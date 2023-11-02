const searchBox = document.querySelector('.searchBox')
const searchBtn = document.querySelector('.searchBtn')
const searchResult = document.querySelector('.searchResult')

const getRecipes = async (query) => {
    const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`)
    const response = await data.json();
    
    response.meals.forEach(meal => {
        console.log(meal);
    });
   
}

searchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const searchInput = searchBox.value.trim();
    getRecipes(searchInput);    
    //console.log('btn');
})