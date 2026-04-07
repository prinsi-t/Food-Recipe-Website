const searchBox = document.querySelector('.searchBox');
const searchBtn = document.querySelector('.searchBtn');
const recipeContainer = document.querySelector('.recipeContainer');
const closeBtn = document.querySelector('.closeBtn');
const recipeContent = document.querySelector('.recipeContent');
const recipeDetailsModal = document.querySelector('.recipeDetails');

// Load initial recipes on page load
window.addEventListener('DOMContentLoaded', () => {
    getRecipes('pizza'); // Default search based on image
});

const getRecipes = async (query) => {
    // Show loading skeleton
    recipeContainer.innerHTML = Array(4).fill(0).map(() => `
        <div class="animate-pulse bg-gray-100 rounded-[40px] h-[450px]"></div>
    `).join('');

    try {
        const response = await fetch(`/api/recipes/search?s=${query}`);
        const data = await response.json();
        
        recipeContainer.innerHTML = '';
        
        if (!data.meals || data.meals.length === 0) {
            recipeContainer.innerHTML = `
                <div class="col-span-full py-20 text-center">
                    <h3 class="text-2xl font-black text-gray-900 mb-2">No delicacies found for "${query}"</h3>
                    <p class="text-gray-400 font-bold uppercase tracking-widest text-xs">Try searching for something else like "Pasta" or "Cake".</p>
                </div>
            `;
            return;
        }

        data.meals.forEach((meal, index) => {
            const recipeDiv = document.createElement('div');
            // Randomly assign some cards to have orange background like in the image
            const isOrangeCard = index % 5 === 1; 
            
            recipeDiv.classList.add('group', 'relative', 'rounded-[40px]', 'overflow-hidden', 'h-[450px]', 'transition-all', 'duration-500', 'hover:-translate-y-2', 'cursor-pointer');
            
            if (isOrangeCard) {
                recipeDiv.classList.add('bg-orange-500', 'p-8', 'flex', 'flex-col', 'justify-center');
                recipeDiv.innerHTML = `
                    <div class="absolute top-8 right-8 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white">
                        <i class="fa-regular fa-heart"></i>
                    </div>
                    <h3 class="text-3xl font-black text-white leading-tight mb-8">
                        "Cooking has <br> never been <br> this easy!"
                    </h3>
                    <div class="mt-auto flex items-center gap-3">
                        <div class="w-12 h-12 rounded-full border-2 border-white/50 overflow-hidden bg-white/10">
                            <img src="${meal.strMealThumb}" 
                                class="w-full h-full object-cover"
                                onerror="this.src='https://images.unsplash.com/photo-1495195129352-aed325a55b65?auto=format&fit=crop&w=100&q=80'; this.onerror=null;">
                        </div>
                        <span class="text-white font-bold text-sm uppercase tracking-widest">Learn From ${meal.strArea}</span>
                    </div>
                `;
            } else {
                recipeDiv.classList.add('bg-gray-100');
                recipeDiv.innerHTML = `
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}" 
                        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        onerror="this.src='https://images.unsplash.com/photo-1495195129352-aed325a55b65?auto=format&fit=crop&w=800&q=80'; this.onerror=null;">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
                        <div class="absolute top-8 right-8 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                            <i class="fa-solid fa-plus"></i>
                        </div>
                        <span class="text-orange-500 font-black text-[10px] uppercase tracking-[0.3em] mb-2">${meal.strCategory || 'Recipe'}</span>
                        <h3 class="text-2xl font-black text-white leading-tight mb-4 line-clamp-2">${meal.strMeal}</h3>
                        <div class="flex items-center justify-between">
                            <span class="text-white/60 font-bold text-[10px] uppercase tracking-widest">${meal.strArea} Cuisine</span>
                            <div class="bg-white text-gray-900 w-8 h-8 rounded-full flex items-center justify-center translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                <i class="fa-solid fa-arrow-right text-[10px]"></i>
                            </div>
                        </div>
                    </div>
                `;
            }
           
            recipeDiv.addEventListener('click', () => {
                showRecipeDetails(meal);
            });

            recipeContainer.appendChild(recipeDiv);
        });
    } catch (error) {
        recipeContainer.innerHTML = `
            <div class="col-span-full py-20 text-center text-red-500">
                <i class="fa-solid fa-circle-exclamation text-4xl mb-4"></i>
                <h3 class="text-xl font-bold">Something went wrong</h3>
                <p>We couldn't load the recipes. Please try again later.</p>
            </div>
        `;
    }
}

const fetchingIngredients = (meal) => {
    let ingredients = '';
    for (let i = 1; i <= 20; i++) {
        let ingredient = meal[`strIngredient${i}`];
        if (ingredient) {
            const measure = meal[`strMeasure${i}`];
            ingredients += `
                <div class="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 group hover:border-orange-200 transition-colors">
                    <div class="w-8 h-8 bg-white rounded-xl flex items-center justify-center text-orange-500 shadow-sm group-hover:bg-orange-500 group-hover:text-white transition-all">
                        <i class="fa-solid fa-check text-[10px]"></i>
                    </div>
                    <span class="text-gray-900 font-bold text-sm">
                        <span class="text-orange-500">${measure}</span> ${ingredient}
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
            <div class="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 group hover:border-orange-200 transition-colors">
                <div class="w-8 h-8 bg-white rounded-xl flex items-center justify-center text-orange-500 shadow-sm group-hover:bg-orange-500 group-hover:text-white transition-all">
                    <i class="fa-solid fa-check text-[10px]"></i>
                </div>
                <span class="text-gray-900 font-bold text-sm">${ing}</span>
            </div>`).join('');
    } else {
        ingredientsList = fetchingIngredients(meal);
    }

    recipeContent.innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-2">
            <div class="relative h-[400px] lg:h-full min-h-[500px]">
                <img src="${meal.strMealThumb}" class="w-full h-full object-cover">
                <div class="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent"></div>
                <div class="absolute bottom-12 left-12 right-12">
                    <span class="bg-orange-500 text-white text-[10px] font-black uppercase tracking-[0.3em] px-4 py-2 rounded-full mb-4 inline-block shadow-xl">
                        ${meal.strCategory || 'Main Course'}
                    </span>
                    <h2 class="text-5xl lg:text-7xl font-black text-white leading-none tracking-tight">${meal.strMeal}</h2>
                </div>
            </div>
            
            <div class="p-12 lg:p-20 bg-white">
                <div class="mb-12">
                    <h3 class="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-6 flex items-center gap-4">
                        <span class="w-8 h-[2px] bg-orange-500"></span>
                        Ingredients
                    </h3>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        ${ingredientsList}
                    </div>
                </div>
                
                <div class="mb-12">
                    <h3 class="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-6 flex items-center gap-4">
                        <span class="w-8 h-[2px] bg-orange-500"></span>
                        Instructions
                    </h3>
                    <div class="text-gray-500 font-medium leading-relaxed space-y-6">
                        ${meal.strInstructions.split('\r\n').filter(p => p.trim()).map(p => `<p>${p}</p>`).join('')}
                    </div>
                </div>

                ${meal.strYoutube ? `
                    <div class="pt-8 border-t border-gray-100">
                        <a href="${meal.strYoutube}" target="_blank" class="inline-flex items-center gap-4 group">
                            <div class="w-16 h-16 bg-red-600 text-white rounded-[20px] flex items-center justify-center shadow-xl shadow-red-200 group-hover:scale-110 transition-transform">
                                <i class="fa-brands fa-youtube text-2xl"></i>
                            </div>
                            <div>
                                <h4 class="font-black text-gray-900 uppercase tracking-widest text-sm mb-1">Watch Tutorial</h4>
                                <p class="text-gray-400 text-xs font-bold uppercase tracking-widest">On YouTube Channel</p>
                            </div>
                        </a>
                    </div>
                ` : ''}
            </div>
        </div>
    `;

    recipeDetailsModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

closeBtn.addEventListener('click', () => {
    recipeDetailsModal.classList.add('hidden');
    document.body.style.overflow = 'auto';
});

recipeDetailsModal.addEventListener('click', (e) => {
    if (e.target === recipeDetailsModal) {
        recipeDetailsModal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
});

searchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const searchInput = searchBox.value.trim();
    if (searchInput) {
        // Redirect to recipes page with search query
        window.location.href = `/recipes.html?s=${encodeURIComponent(searchInput)}`;
    }
});
