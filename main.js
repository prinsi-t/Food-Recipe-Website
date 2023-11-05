const searchBox = document.querySelector('.searchBox')
const searchBtn = document.querySelector('.searchBtn')
const recipeContainer = document.querySelector('.recipeContainer')
const closeBtn = document.querySelector('.closeBtn')
const recipeContent = document.querySelector('.recipeContent')


const getRecipes = async (query) => {
    recipeContainer.innerHTML = '<h2>Fetching Your Recipes....</h2>';
    const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`)
    const response = await data.json();
    
    recipeContainer.innerHTML = '';
    response.meals.forEach(meal => {
        const recipe = document.createElement('div');
        recipe.classList.add('recipe');
        recipe.innerHTML = `
            <img src='${meal.strMealThumb}'>
            <h3>${meal.strMeal}</h3>
            <p>${meal.strArea}</p>
           
        `
        const button = document.createElement('button');
        button.textContent = 'Recipe';
        recipe.appendChild(button)

        button.addEventListener('click', () => {
            recipeDetails(meal)
        })

        recipeContainer.appendChild(recipe);
        //console.log(meal);
    });
   
}

const fetchingIngredients = (meal) => {
    let ingredients = '';
    for (let i = 1; i <= 20; i++){
        let ingredient = meal[`strIngredient${i}`];
        if(ingredient){
            const measure = meal[`strMeasure${i}`];
            ingredients += `<li>${measure} ${ingredient} </li>`
        }else{
            break;
        }
    }
    return ingredients;
    //console.log(meal);
}

const recipeDetails = (meal) => {
    recipeContent.innerHTML = `
        <h2 class = 'recipeName'>${meal.strMeal}</h2>
        <h3 class = 'ingredient'>Ingredients:</h3>
        <ul class = 'ingredientsList'>${fetchingIngredients(meal)}

        <div>
            <h3 class = 'instruction'>Instructions:</h3>
            <p class = 'instructions'> ${meal.strInstructions}</p>
        </div>
    `

    recipeContent.parentElement.style.display = 'block';
}

closeBtn.addEventListener('click', () => {
    recipeContent.parentElement.style.display = 'none';
})

searchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const searchInput = searchBox.value.trim();
    getRecipes(searchInput);    
    //console.log('btn');
})