const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection
const mongoOptions = {
    serverSelectionTimeoutMS: 10000,
};

mongoose.connect(process.env.MONGO_URI, mongoOptions)
    .then(() => {
        console.log('✅ Connected to MongoDB Atlas successfully!');
        console.log(`Database name: ${mongoose.connection.name}`);
    })
    .catch(err => {
        console.error('❌ MongoDB Connection Error:');
        if (err.message.includes('ECONNREFUSED')) {
            console.error('Your network is blocking the MongoDB Atlas SRV record.');
            console.log('Try using the "Standard Connection String" (the one for older drivers) from MongoDB Atlas.');
        } else {
            console.error(err.message);
        }
        console.log('Searching will continue using the external API as fallback.');
    });

// Set up middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define a simple Recipe model
const recipeSchema = new mongoose.Schema({
    idMeal: { type: String, unique: true }, // TheMealDB unique ID
    name: String,
    area: String,
    category: String,
    ingredients: [String],
    instructions: String,
    image: String,
    source: String,
    youtube: String
}, { bufferCommands: false }); // Disable buffering if connection is not ready

const Recipe = mongoose.model('Recipe', recipeSchema);

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/recipes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'recipes.html'));
});

app.get('/blog', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'blog.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});

// API endpoint to search recipes
app.get('/api/recipes/search', async (req, res) => {
    const query = req.query.s || '';
    console.log(`Searching for: ${query}`);

    try {
        // If query is empty, return some default/latest recipes
        if (!query) {
            if (mongoose.connection.readyState === 1) {
                const recipes = await Recipe.find({}).limit(20);
                return res.json({ 
                    meals: recipes.map(r => ({
                        idMeal: r.idMeal,
                        strMeal: r.name,
                        strArea: r.area,
                        strCategory: r.category,
                        strMealThumb: r.image,
                        strInstructions: r.instructions,
                        ingredients: r.ingredients,
                        isLocal: true
                    }))
                });
            }
            // Fallback to external API for "popular" or random if no local data
            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=`);
            const data = await response.json();
            return res.json(data);
        }

        // 1. Fetch from external API
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
        const data = await response.json();
        
        // 2. Store results in MongoDB (if connected)
        if (mongoose.connection.readyState === 1 && data.meals) {
            console.log(`Saving ${data.meals.length} recipes to MongoDB...`);
            const ops = data.meals.map(meal => ({
                updateOne: {
                    filter: { idMeal: meal.idMeal },
                    update: {
                        idMeal: meal.idMeal,
                        name: meal.strMeal,
                        area: meal.strArea,
                        category: meal.strCategory,
                        image: meal.strMealThumb,
                        instructions: meal.strInstructions,
                        ingredients: Array.from({ length: 20 }, (_, i) => i + 1)
                            .map(i => meal[`strMeasure${i}`] && meal[`strIngredient${i}`] ? `${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}` : null)
                            .filter(Boolean),
                        source: meal.strSource,
                        youtube: meal.strYoutube
                    },
                    upsert: true
                }
            }));
            
            if (ops.length > 0) {
                await Recipe.bulkWrite(ops);
            }
        }

        // 3. Get results from MongoDB (now includes the newly added ones)
        if (mongoose.connection.readyState === 1) {
            const recipes = await Recipe.find({ name: { $regex: query, $options: 'i' } }).limit(20);
            console.log(`Found ${recipes.length} local recipes.`);
            return res.json({ 
                meals: recipes.map(r => ({
                    idMeal: r.idMeal,
                    strMeal: r.name,
                    strArea: r.area,
                    strCategory: r.category,
                    strMealThumb: r.image,
                    strInstructions: r.instructions,
                    ingredients: r.ingredients,
                    isLocal: true
                }))
            });
        }

        console.log(`Returning ${data.meals ? data.meals.length : 0} recipes from external API (DB disconnected).`);
        res.json(data);
    } catch (err) {
        console.error('Search error:', err);
        res.status(500).json({ message: 'Error searching recipes', error: err.message });
    }
});

// API endpoint to manually add a recipe
app.post('/api/recipes/add', async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({ message: 'Database not connected' });
        }

        const { name, area, category, ingredients, instructions, image, youtube, source } = req.body;
        
        // Generate a random idMeal if not provided (like a custom recipe)
        const idMeal = req.body.idMeal || 'custom_' + Date.now();

        const newRecipe = new Recipe({
            idMeal,
            name,
            area,
            category,
            ingredients,
            instructions,
            image,
            youtube,
            source
        });

        await newRecipe.save();
        res.status(201).json({ message: 'Recipe added successfully!', recipe: newRecipe });
    } catch (err) {
        console.error('Add recipe error:', err);
        res.status(500).json({ message: 'Error adding recipe', error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
