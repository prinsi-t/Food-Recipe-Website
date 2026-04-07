const searchForm = document.querySelector('.search-form');
const searchInput = document.querySelector('.search-input');
const recipeContainer = document.querySelector('.recipe-container');
const resultsTitle = document.querySelector('.results-title');
const resultsCount = document.querySelector('.results-count');
const recipeDetailsModal = document.querySelector('.recipeDetails');
const recipeContent = document.querySelector('.recipeContent');
const closeBtn = document.querySelector('.closeBtn');
const OPEN_RECIPE_STORAGE_KEY = 'openRecipeId';

const searchToggle = document.querySelector('.search-toggle');
const categoryPills = document.querySelectorAll('.category-pill');
let currentMeals = [];

// Category Pill Functionality
categoryPills.forEach(pill => {
    pill.addEventListener('click', () => {
        const category = pill.textContent.trim();
        searchInput.value = category === 'All' ? '' : category;
        getRecipes(category === 'All' ? 'all' : category);
        
        // Update active state
        categoryPills.forEach(p => p.classList.remove('bg-orange-500', 'text-white'));
        pill.classList.add('bg-orange-500', 'text-white');
    });
});

// Focus search input when search icon in header is clicked
if (searchToggle) {
    searchToggle.addEventListener('click', () => {
        searchInput.focus();
        searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
}

// Load recipes based on URL parameter or default
window.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('s');
    
    if (query) {
        searchInput.value = query;
        await getRecipes(query);
    } else {
        await getRecipes('all'); // Fetch all or popular
    }

    restoreOpenRecipe();
});

const getRecipes = async (query) => {
    // Show skeleton loading
    recipeContainer.innerHTML = Array(8).fill(0).map(() => `
        <div class="animate-pulse bg-white rounded-3xl overflow-hidden shadow-sm h-[400px]">
            <div class="bg-gray-200 h-48"></div>
            <div class="p-6 space-y-4">
                <div class="h-4 bg-gray-200 rounded w-1/4"></div>
                <div class="h-6 bg-gray-200 rounded w-3/4"></div>
                <div class="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
        </div>
    `).join('');

    try {
        const response = await fetch(`/api/recipes/search?s=${query === 'all' ? '' : query}`);
        const data = await response.json();
        
        recipeContainer.innerHTML = '';
        
        if (!data.meals || data.meals.length === 0) {
            currentMeals = [];
            resultsCount.textContent = '0 recipes found';
            recipeContainer.innerHTML = `
                <div class="col-span-full py-20 text-center">
                    <div class="bg-orange-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <i class="fa-solid fa-magnifying-glass text-orange-300 text-3xl"></i>
                    </div>
                    <h3 class="text-2xl font-bold text-gray-900 mb-2">No recipes found</h3>
                    <p class="text-gray-500">We couldn't find any recipes matching "${query}". Try another keyword.</p>
                </div>
            `;
            return;
        }

        currentMeals = data.meals;
        resultsCount.textContent = `${data.meals.length} recipes found`;
        resultsTitle.textContent = query === 'all' ? 'All Recipes' : `Search Results for "${query}"`;

        data.meals.forEach((meal) => {
            const recipeDiv = document.createElement('div');
            recipeDiv.classList.add('group', 'bg-white', 'rounded-3xl', 'overflow-hidden', 'shadow-sm', 'hover:shadow-xl', 'transition-all', 'duration-500', 'cursor-pointer', 'border', 'border-gray-100');
            
            recipeDiv.innerHTML = `
                <div class="relative h-48 overflow-hidden bg-gray-100">
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}" 
                        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        onerror="this.src='https://images.unsplash.com/photo-1495195129352-aed325a55b65?auto=format&fit=crop&w=800&q=80'; this.onerror=null;">
                    <div class="absolute top-4 right-4">
                        <span class="bg-white/90 backdrop-blur-sm text-gray-900 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                            ${meal.strArea || 'International'}
                        </span>
                    </div>
                </div>
                <div class="p-6">
                    <div class="flex items-center gap-2 text-orange-500 text-[10px] font-bold uppercase tracking-widest mb-3">
                        <i class="fa-solid fa-utensils"></i>
                        <span>${meal.strCategory || 'Recipe'}</span>
                    </div>
                    <h3 class="text-lg font-bold text-gray-900 group-hover:text-orange-500 transition-colors line-clamp-2 mb-4 leading-tight">
                        ${meal.strMeal}
                    </h3>
                    <div class="flex items-center justify-between pt-4 border-t border-gray-50">
                        <span class="text-gray-400 text-xs font-medium">View Recipe</span>
                        <div class="w-8 h-8 bg-gray-50 group-hover:bg-orange-500 group-hover:text-white rounded-full flex items-center justify-center transition-all duration-300">
                            <i class="fa-solid fa-arrow-right text-[10px]"></i>
                        </div>
                    </div>
                </div>
            `;
           
            recipeDiv.addEventListener('click', () => {
                showRecipeDetails(meal);
            });

            recipeContainer.appendChild(recipeDiv);
        });
    } catch (error) {
        console.error(error);
        recipeContainer.innerHTML = `<div class="col-span-full py-20 text-center text-red-500">Failed to load recipes.</div>`;
    }
}

const fetchingIngredients = (meal) => {
    let ingredients = '';
    for (let i = 1; i <= 20; i++) {
        let ingredient = meal[`strIngredient${i}`];
        if (ingredient) {
            const measure = meal[`strMeasure${i}`];
            ingredients += `
                <div class="flex items-center gap-3 p-3.5 bg-gray-50 rounded-2xl border border-gray-100 group hover:border-orange-200 transition-colors">
                    <div class="w-7 h-7 bg-white rounded-lg flex items-center justify-center text-orange-500 shadow-sm group-hover:bg-orange-500 group-hover:text-white transition-all">
                        <i class="fa-solid fa-check text-[10px]"></i>
                    </div>
                    <span class="text-gray-800 font-semibold text-sm leading-snug">
                        <span class="text-orange-500 font-bold">${measure}</span> ${ingredient}
                    </span>
                </div>`;
        } else {
            break;
        }
    }
    return ingredients;
}

const showRecipeDetails = (meal) => {
    let ingredientsList = '';
    if (meal.ingredients && Array.isArray(meal.ingredients)) {
        ingredientsList = meal.ingredients.map(ing => `
            <div class="flex items-center gap-3 p-3.5 bg-gray-50 rounded-2xl border border-gray-100 group hover:border-orange-200 transition-colors">
                <div class="w-7 h-7 bg-white rounded-lg flex items-center justify-center text-orange-500 shadow-sm group-hover:bg-orange-500 group-hover:text-white transition-all">
                    <i class="fa-solid fa-check text-[10px]"></i>
                </div>
                <span class="text-gray-800 font-semibold text-sm leading-snug">${ing}</span>
            </div>`).join('');
    } else {
        ingredientsList = fetchingIngredients(meal);
    }

    recipeContent.innerHTML = `
        <div class="flex flex-col lg:flex-row bg-white rounded-[40px] overflow-hidden shadow-2xl relative lg:max-h-[85vh]">
            <!-- Left Side: Full Height Image -->
            <div class="lg:w-[42%] relative h-[220px] sm:h-[280px] lg:h-auto lg:max-h-[85vh]">
                <img src="${meal.strMealThumb}" 
                    class="w-full h-full object-cover object-center"
                    onerror="this.src='https://images.unsplash.com/photo-1495195129352-aed325a55b65?auto=format&fit=crop&w=1200&q=80'; this.onerror=null;">
                <div class="absolute inset-0 bg-gradient-to-t from-black/20 via-black/5 to-transparent"></div>
            </div>
            
            <!-- Right Side: Content -->
            <div class="lg:w-[58%] p-6 sm:p-8 lg:p-10 bg-white relative overflow-y-auto lg:max-h-[85vh]">
                <div class="mb-8">
                    <span class="bg-orange-100 text-orange-600 text-[10px] font-extrabold uppercase tracking-[0.24em] px-3 py-1.5 rounded-full mb-3 inline-block">
                        ${meal.strCategory || 'Main Course'}
                    </span>
                    <h2 class="text-3xl lg:text-[2.2rem] font-extrabold text-gray-900 leading-tight mb-2">${meal.strMeal}</h2>
                    <p class="text-gray-500 text-xs sm:text-sm font-semibold uppercase tracking-[0.18em] flex items-center gap-2">
                        <i class="fa-solid fa-globe"></i> ${meal.strArea || 'International'} Cuisine
                    </p>
                </div>

                <!-- Ingredients Section -->
                <div class="mb-8">
                    <h3 class="text-[10px] font-extrabold uppercase tracking-[0.34em] text-gray-400 mb-5 flex items-center gap-4">
                        <span class="w-10 h-[2px] bg-orange-500"></span>
                        Ingredients
                    </h3>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        ${ingredientsList}
                    </div>
                </div>
                
                <!-- Instructions Section -->
                <div class="mb-8">
                    <h3 class="text-[10px] font-extrabold uppercase tracking-[0.34em] text-gray-400 mb-5 flex items-center gap-4">
                        <span class="w-10 h-[2px] bg-orange-500"></span>
                        Instructions
                    </h3>
                    <div class="text-gray-600 text-[15px] font-normal leading-7 space-y-3 pr-2">
                        ${meal.strInstructions ? meal.strInstructions.split(/\r?\n/).filter(p => p.trim()).map(p => `<p class="mb-3">${p.trim()}</p>`).join('') : 'No instructions available.'}
                    </div>
                </div>

                ${meal.strYoutube ? `
                    <div class="pt-8 border-t border-gray-100">
                        <a href="${meal.strYoutube}" target="_blank" class="inline-flex items-center gap-4 group">
                            <div class="w-12 h-12 bg-red-600 text-white rounded-[15px] flex items-center justify-center shadow-xl shadow-red-100 group-hover:scale-110 transition-transform">
                                <i class="fa-brands fa-youtube text-xl"></i>
                            </div>
                            <div>
                                <h4 class="font-black text-gray-900 uppercase tracking-widest text-xs mb-1">Watch Tutorial</h4>
                                <p class="text-gray-400 text-[10px] font-bold uppercase tracking-widest">On YouTube Channel</p>
                            </div>
                        </a>
                    </div>
                ` : ''}
            </div>
        </div>
    `;

    recipeDetailsModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    if (meal.idMeal) {
        sessionStorage.setItem(OPEN_RECIPE_STORAGE_KEY, meal.idMeal);
    }
}

const closeRecipeModal = () => {
    recipeDetailsModal.classList.add('hidden');
    document.body.style.overflow = 'auto';
    sessionStorage.removeItem(OPEN_RECIPE_STORAGE_KEY);
};

const restoreOpenRecipe = () => {
    const openRecipeId = sessionStorage.getItem(OPEN_RECIPE_STORAGE_KEY);
    if (!openRecipeId || !currentMeals.length) return;

    const mealToRestore = currentMeals.find(meal => meal.idMeal === openRecipeId);
    if (mealToRestore) {
        showRecipeDetails(mealToRestore);
    } else {
        sessionStorage.removeItem(OPEN_RECIPE_STORAGE_KEY);
    }
};

closeBtn.addEventListener('click', closeRecipeModal);

recipeDetailsModal.addEventListener('click', (e) => {
    if (e.target === recipeDetailsModal) {
        closeRecipeModal();
    }
});

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (query) {
        getRecipes(query);
    }
});
