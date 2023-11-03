const searchBox = document.querySelector('.searchBox')
const searchBtn = document.querySelector('.searchBtn')
const recipeContainer = document.querySelector('.recipeContainer')

const getRecipes = async (query) => {
    recipeContainer.innerHTML = '<h2>Fetching Your Recipes....</h2>';
    const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`)
    const response = await data.json();
    
    recipeContainer.innerHTML = '';
    response.meals.forEach(meal => {
        const recipe = document.createElement('div');
        recipe.classList.add('recipe');
        recipe.innerHTML = `
            <img class='img' src='${meal.strMealThumb}'>
            <h3>${meal.strMeal}</h3>
            <p>${meal.strArea}</p>
            <button>${}
        `
        recipeContainer.appendChild(recipe);
        //console.log(meal);
    });
   
}

searchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const searchInput = searchBox.value.trim();
    getRecipes(searchInput);    
    //console.log('btn');
})