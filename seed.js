const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const recipeSchema = new mongoose.Schema({
    idMeal: { type: String, unique: true },
    name: String,
    area: String,
    category: String,
    ingredients: [String],
    instructions: String,
    image: String,
    source: String,
    youtube: String
});

const Recipe = mongoose.model('Recipe', recipeSchema);

const sampleRecipes = [
    {
        idMeal: 'manual_001',
        name: 'Homemade Pizza',
        area: 'Italian',
        category: 'Main',
        ingredients: ['2 cups Flour', '1 tsp Yeast', '1/2 cup Tomato Sauce', '1 cup Mozzarella', 'Fresh Basil'],
        instructions: '1. Mix flour and yeast with warm water. 2. Knead the dough for 10 minutes. 3. Let it rise for 1 hour. 4. Roll out the dough. 5. Add tomato sauce and toppings. 6. Bake at 450°F for 15 minutes until golden.',
        image: 'https://www.themealdb.com/images/media/meals/x0lk911587671540.jpg'
    },
    {
        idMeal: 'manual_002',
        name: 'Fresh Garden Salad',
        area: 'International',
        category: 'Side',
        ingredients: ['Lettuce', 'Tomato', 'Cucumber', '2 tbsp Olive Oil', '1 tbsp Lemon Juice', 'Salt', 'Black Pepper'],
        instructions: '1. Wash and chop all vegetables. 2. Mix in a large bowl. 3. Drizzle with olive oil and lemon juice. 4. Season with salt and pepper. 5. Toss well and serve immediately.',
        image: 'https://www.themealdb.com/images/media/meals/wvpsxx1468256321.jpg'
    },
    {
        idMeal: 'manual_003',
        name: 'Chicken Curry',
        area: 'Indian',
        category: 'Main',
        ingredients: ['500g Chicken', '2 Onions', '3 Tomatoes', '1 tbsp Curry Powder', '1 cup Coconut Milk', '2 cloves Garlic', '1 inch Ginger'],
        instructions: '1. Sauté chopped onions until golden. 2. Add minced garlic and ginger. 3. Add chicken pieces and brown them. 4. Add curry powder and mix well. 5. Add chopped tomatoes and cook until soft. 6. Pour in coconut milk and simmer for 20 minutes.',
        image: 'https://www.themealdb.com/images/media/meals/1529444113.jpg'
    },
    {
        idMeal: 'manual_004',
        name: 'Sushi Rolls',
        area: 'Japanese',
        category: 'Main',
        ingredients: ['2 cups Sushi Rice', '4 Nori Sheets', '200g Fresh Salmon', '1 Cucumber', 'Soy Sauce', 'Wasabi', 'Pickled Ginger'],
        instructions: '1. Cook sushi rice according to package. 2. Let rice cool to room temperature. 3. Place nori on bamboo mat. 4. Spread rice evenly on nori. 5. Add salmon and cucumber strips. 6. Roll tightly using the mat. 7. Slice into 8 pieces. 8. Serve with soy sauce and wasabi.',
        image: 'https://www.themealdb.com/images/media/meals/g046bb1673260225.jpg'
    },
    {
        idMeal: 'manual_005',
        name: 'Classic Beef Burger',
        area: 'American',
        category: 'Fast Food',
        ingredients: ['500g Ground Beef', '4 Burger Buns', '4 slices Cheddar Cheese', 'Lettuce', '1 Onion', '2 Tomatoes', 'Ketchup', 'Mustard'],
        instructions: '1. Shape ground beef into 4 patties. 2. Season with salt and pepper. 3. Grill patties for 5 minutes each side. 4. Add cheese in the last minute. 5. Toast the buns lightly. 6. Assemble burger with lettuce, tomato, onion, and condiments.',
        image: 'https://www.themealdb.com/images/media/meals/urzj1d1587670726.jpg'
    },
    {
        idMeal: 'manual_006',
        name: 'Beef Tacos',
        area: 'Mexican',
        category: 'Main',
        ingredients: ['8 Taco Shells', '500g Ground Beef', '1 packet Taco Seasoning', 'Salsa', '1 Avocado', 'Sour Cream', 'Cheddar Cheese', 'Lettuce'],
        instructions: '1. Cook ground beef in a pan. 2. Add taco seasoning and water. 3. Simmer until thickened. 4. Warm taco shells in oven. 5. Fill shells with beef. 6. Top with salsa, avocado, sour cream, cheese, and lettuce.',
        image: 'https://www.themealdb.com/images/media/meals/uvuyxu1503067369.jpg'
    },
    {
        idMeal: 'manual_007',
        name: 'Pad Thai',
        area: 'Thai',
        category: 'Main',
        ingredients: ['200g Rice Noodles', '200g Shrimp', '2 Eggs', 'Bean Sprouts', 'Peanuts', '3 tbsp Fish Sauce', '2 tbsp Tamarind Paste', 'Lime'],
        instructions: '1. Soak rice noodles in warm water. 2. Heat oil in wok. 3. Cook shrimp until pink. 4. Push aside and scramble eggs. 5. Add drained noodles. 6. Add fish sauce and tamarind. 7. Toss with bean sprouts. 8. Serve with peanuts and lime.',
        image: 'https://www.themealdb.com/images/media/meals/kkolyb1582548555.jpg'
    },
    {
        idMeal: 'manual_008',
        name: 'Greek Moussaka',
        area: 'Greek',
        category: 'Main',
        ingredients: ['2 Eggplants', '500g Ground Lamb', '2 Onions', '2 cups Béchamel Sauce', '1 can Tomatoes', 'Cinnamon', 'Parmesan'],
        instructions: '1. Slice and grill eggplants. 2. Cook lamb with onions. 3. Add tomatoes and cinnamon. 4. Layer eggplant and meat in dish. 5. Top with béchamel sauce. 6. Sprinkle parmesan. 7. Bake at 350°F for 45 minutes.',
        image: 'https://www.themealdb.com/images/media/meals/1550441275.jpg'
    },
    {
        idMeal: 'manual_009',
        name: 'French Croissants',
        area: 'French',
        category: 'Breakfast',
        ingredients: ['3 cups Flour', '1/4 cup Sugar', '2 tsp Yeast', '1 cup Butter', '1 cup Milk', '1 Egg'],
        instructions: '1. Mix flour, sugar, and yeast. 2. Add warm milk and knead. 3. Refrigerate dough overnight. 4. Roll out and fold with butter. 5. Repeat folding 3 times. 6. Cut into triangles and roll. 7. Let rise for 2 hours. 8. Brush with egg wash. 9. Bake at 400°F for 20 minutes.',
        image: 'https://www.themealdb.com/images/media/meals/rqtxvr1511792990.jpg'
    },
    {
        idMeal: 'manual_010',
        name: 'Spanish Paella',
        area: 'Spanish',
        category: 'Main',
        ingredients: ['2 cups Paella Rice', '1 lb Chicken', '1 lb Shrimp', 'Saffron', 'Paprika', 'Bell Peppers', 'Green Peas', 'Chicken Stock'],
        instructions: '1. Brown chicken pieces in paella pan. 2. Add chopped peppers. 3. Stir in rice and coat with oil. 4. Add saffron to hot stock. 5. Pour stock over rice. 6. Add shrimp and peas. 7. Cook without stirring for 20 minutes.',
        image: 'https://www.themealdb.com/images/media/meals/wx9wvx1580303970.jpg'
    },
    {
        idMeal: 'manual_011',
        name: 'Korean Bibimbap',
        area: 'Korean',
        category: 'Main',
        ingredients: ['2 cups Rice', '200g Beef', 'Spinach', 'Bean Sprouts', 'Carrots', 'Gochujang', '2 Eggs', 'Sesame Oil'],
        instructions: '1. Cook rice and keep warm. 2. Marinate and cook beef. 3. Blanch spinach and bean sprouts. 4. Julienne and sauté carrots. 5. Fry eggs sunny-side up. 6. Arrange all ingredients over rice. 7. Top with egg and gochujang. 8. Mix before eating.',
        image: 'https://www.themealdb.com/images/media/meals/ttrs1t1582572107.jpg'
    },
    {
        idMeal: 'manual_012',
        name: 'Brazilian Feijoada',
        area: 'Brazilian',
        category: 'Main',
        ingredients: ['2 cups Black Beans', '500g Pork', '200g Sausage', 'Bay Leaves', 'Garlic', 'Orange', 'Rice', 'Collard Greens'],
        instructions: '1. Soak black beans overnight. 2. Cook beans with bay leaves. 3. Add pork and sausage. 4. Simmer for 2 hours. 5. Prepare white rice. 6. Sauté collard greens. 7. Serve beans over rice with orange slices.',
        image: 'https://www.themealdb.com/images/media/meals/n7qnae1487774140.jpg'
    },
    {
        idMeal: 'manual_013',
        name: 'Chinese Kung Pao Chicken',
        area: 'Chinese',
        category: 'Main',
        ingredients: ['500g Chicken Breast', 'Peanuts', '3 Dried Chilies', 'Soy Sauce', 'Rice Vinegar', 'Cornstarch', 'Ginger', 'Spring Onions'],
        instructions: '1. Cut chicken into cubes. 2. Marinate in soy sauce and cornstarch. 3. Heat wok with oil. 4. Stir-fry chicken until golden. 5. Add chilies and ginger. 6. Add sauce mixture. 7. Toss in peanuts. 8. Garnish with spring onions.',
        image: 'https://www.themealdb.com/images/media/meals/1525872624.jpg'
    },
    {
        idMeal: 'manual_014',
        name: 'Moroccan Tagine',
        area: 'Moroccan',
        category: 'Main',
        ingredients: ['500g Lamb', 'Chickpeas', 'Apricots', 'Onions', 'Cumin', 'Coriander', 'Cinnamon', 'Almonds', 'Couscous'],
        instructions: '1. Brown lamb pieces. 2. Add chopped onions and spices. 3. Add chickpeas and apricots. 4. Add water and simmer 1.5 hours. 5. Toast almonds. 6. Prepare couscous. 7. Serve tagine over couscous with almonds.',
        image: 'https://www.themealdb.com/images/media/meals/qtuwxu1468233098.jpg'
    },
    {
        idMeal: 'manual_015',
        name: 'Vietnamese Pho',
        area: 'Vietnamese',
        category: 'Soup',
        ingredients: ['Beef Bones', 'Rice Noodles', 'Beef Slices', 'Star Anise', 'Cinnamon', 'Ginger', 'Fish Sauce', 'Bean Sprouts', 'Basil', 'Lime'],
        instructions: '1. Simmer beef bones for 6 hours with spices. 2. Strain broth. 3. Cook rice noodles. 4. Slice beef thinly. 5. Pour hot broth over noodles and raw beef. 6. Top with bean sprouts, basil, and lime.',
        image: 'https://www.themealdb.com/images/media/meals/k29viq1585565980.jpg'
    },
    {
        idMeal: 'manual_016',
        name: 'Turkish Kebab',
        area: 'Turkish',
        category: 'Main',
        ingredients: ['500g Lamb', 'Yogurt', 'Paprika', 'Cumin', 'Pita Bread', 'Onions', 'Tomatoes', 'Lettuce', 'Tahini Sauce'],
        instructions: '1. Marinate lamb in yogurt and spices for 2 hours. 2. Thread onto skewers. 3. Grill for 15 minutes. 4. Warm pita bread. 5. Chop vegetables. 6. Assemble kebab in pita with vegetables and tahini sauce.',
        image: 'https://www.themealdb.com/images/media/meals/tkxquw1628771028.jpg'
    },
    {
        idMeal: 'manual_017',
        name: 'Italian Risotto',
        area: 'Italian',
        category: 'Main',
        ingredients: ['2 cups Arborio Rice', '1 liter Chicken Stock', '1 cup White Wine', 'Parmesan', 'Butter', 'Onion', 'Saffron'],
        instructions: '1. Heat stock in a pot. 2. Sauté chopped onion in butter. 3. Add rice and coat with butter. 4. Add wine and let absorb. 5. Add stock one ladle at a time, stirring constantly. 6. Add saffron. 7. Finish with parmesan and butter.',
        image: 'https://www.themealdb.com/images/media/meals/vrspxv1511722107.jpg'
    },
    {
        idMeal: 'manual_018',
        name: 'Indian Butter Chicken',
        area: 'Indian',
        category: 'Main',
        ingredients: ['500g Chicken', 'Butter', 'Cream', 'Tomato Paste', 'Garam Masala', 'Garlic', 'Ginger', 'Cashews', 'Naan Bread'],
        instructions: '1. Marinate chicken in yogurt and spices. 2. Grill chicken until charred. 3. Make sauce with butter, tomatoes, cream. 4. Blend with cashews for richness. 5. Add chicken to sauce. 6. Simmer for 20 minutes. 7. Serve with naan bread.',
        image: 'https://www.themealdb.com/images/media/meals/tkxquw1628771028.jpg'
    },
    {
        idMeal: 'manual_019',
        name: 'Classic Chocolate Cake',
        area: 'American',
        category: 'Dessert',
        ingredients: ['2 cups Flour', '2 cups Sugar', '3/4 cup Cocoa Powder', '2 Eggs', '1 cup Milk', 'Butter', 'Vanilla Extract', 'Chocolate Frosting'],
        instructions: '1. Preheat oven to 350°F. 2. Mix dry ingredients. 3. Beat eggs, milk, and vanilla. 4. Combine wet and dry ingredients. 5. Pour into greased pans. 6. Bake for 30 minutes. 7. Cool completely. 8. Frost with chocolate frosting.',
        image: 'https://www.themealdb.com/images/media/meals/wxywrq1468235067.jpg'
    },
    {
        idMeal: 'manual_020',
        name: 'English Fish and Chips',
        area: 'British',
        category: 'Main',
        ingredients: ['4 Cod Fillets', '4 Potatoes', 'Flour', 'Beer', 'Baking Powder', 'Salt', 'Oil for Frying', 'Tartar Sauce', 'Lemon'],
        instructions: '1. Cut potatoes into chips and soak in water. 2. Make batter with flour, beer, and baking powder. 3. Heat oil to 350°F. 4. Fry chips until golden. 5. Dip fish in batter. 6. Fry fish for 5 minutes. 7. Serve with tartar sauce and lemon.',
        image: 'https://www.themealdb.com/images/media/meals/wwxuwt1483641082.jpg'
    }
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB...');

        for (const recipe of sampleRecipes) {
            await Recipe.findOneAndUpdate(
                { idMeal: recipe.idMeal },
                recipe,
                { upsert: true, new: true }
            );
            console.log(`Added/Updated: ${recipe.name}`);
        }

        console.log(`✅ Seeding completed! Added ${sampleRecipes.length} recipes.`);
        process.exit(0);
    } catch (err) {
        console.error('Seeding error:', err);
        process.exit(1);
    }
}

seed();