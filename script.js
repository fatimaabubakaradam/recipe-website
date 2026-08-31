/**
 * Fatima’s Kitchen ✦ Senior Frontend & Motion Implementation
 * Preserves original API endpoints and data fetching logic while delivering an editorial culinary experience.
 */

// DOM Elements
const allContainer = document.getElementById('all');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const clearSearchBtn = document.getElementById('clear-search-btn');

const resultsTitle = document.getElementById('results-title');
const resultsCount = document.getElementById('results-count');

const skeletonContainer = document.getElementById('skeleton-container');
const emptyState = document.getElementById('empty-state');
const emptyMessage = document.getElementById('empty-message');
const emptyResetBtn = document.getElementById('empty-reset-btn');
const errorState = document.getElementById('error-state');
const errorRetryBtn = document.getElementById('error-retry-btn');

const searchToast = document.getElementById('search-toast');
const toastMessage = document.getElementById('toast-message');

const modalBackdrop = document.getElementById('modal-backdrop');
const recipeModal = document.getElementById('recipe-modal');
const modalContent = document.getElementById('modal-content');
const modalCloseBtn = document.getElementById('modal-close-btn');

const newsletterModalBackdrop = document.getElementById('newsletter-modal-backdrop');
const newsletterCloseBtn = document.getElementById('newsletter-close-btn');
const newsletterPopupForm = document.getElementById('newsletter-popup-form');
const inlineNewsletterForm = document.getElementById('inline-newsletter-form');

const mobileToggle = document.getElementById('mobile-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const tagPills = document.querySelectorAll('.tag-pill');
const categoryCards = document.querySelectorAll('.category-card');

const favoritesTabBtn = document.getElementById('favorites-tab-btn');
const favoritesBadge = document.getElementById('favorites-badge');
const mobileFavCount = document.getElementById('mobile-fav-count');
const showAllBtn = document.getElementById('show-all-btn');
const showFavBtn = document.getElementById('show-fav-btn');
const savedCountBtn = document.getElementById('saved-count-btn');

let currentMeals = [];
let currentQuery = 'chicken';
let activeFilter = 'all'; // 'all' or 'favorites'

// Favorites LocalStorage Management
const FAVORITES_KEY = 'fatimas_kitchen_favorites';

const getFavorites = () => {
    try {
        const stored = localStorage.getItem(FAVORITES_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        return [];
    }
};

const saveFavorites = (favs) => {
    try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
        updateFavoritesBadges();
    } catch (e) {
        console.error('Could not save favorites', e);
    }
};

const isMealFavorite = (idMeal) => {
    const favs = getFavorites();
    return favs.some(item => item.idMeal === idMeal);
};

const toggleFavorite = (meal) => {
    let favs = getFavorites();
    const index = favs.findIndex(item => item.idMeal === meal.idMeal);
    if (index > -1) {
        favs.splice(index, 1);
    } else {
        favs.push(meal);
    }
    saveFavorites(favs);

    if (activeFilter === 'favorites') {
        renderFavoritesView();
    } else {
        displayMeals(currentMeals, currentQuery);
    }
};

const updateFavoritesBadges = () => {
    const count = getFavorites().length;
    if (favoritesBadge) favoritesBadge.textContent = count;
    if (mobileFavCount) mobileFavCount.textContent = count;
    if (savedCountBtn) savedCountBtn.textContent = count;
};

// Search Toast Notification
const triggerToast = (message) => {
    if (!searchToast) return;
    if (toastMessage) toastMessage.textContent = message;
    searchToast.classList.remove('hidden');
    setTimeout(() => {
        searchToast.classList.add('hidden');
    }, 3500);
};

// Render Skeleton Cards
const renderSkeletonLoaders = () => {
    if (!skeletonContainer) return;
    skeletonContainer.innerHTML = '';
    for (let i = 0; i < 6; i++) {
        const skeletonCard = document.createElement('div');
        skeletonCard.className = 'skeleton-card';
        skeletonCard.innerHTML = `
            <div class="skeleton-img"></div>
            <div class="skeleton-body">
                <div class="skeleton-line title"></div>
                <div class="skeleton-line"></div>
                <div class="skeleton-line short"></div>
            </div>
        `;
        skeletonContainer.appendChild(skeletonCard);
    }
};

// UI State Controls
const showLoadingState = () => {
    renderSkeletonLoaders();
    if (skeletonContainer) skeletonContainer.classList.remove('hidden');
    if (allContainer) allContainer.classList.add('hidden');
    if (emptyState) emptyState.classList.add('hidden');
    if (errorState) errorState.classList.add('hidden');
};

const hideLoadingState = () => {
    if (skeletonContainer) skeletonContainer.classList.add('hidden');
    if (allContainer) allContainer.classList.remove('hidden');
};

const showEmptyState = (query) => {
    hideLoadingState();
    if (allContainer) allContainer.classList.add('hidden');
    if (emptyState) {
        emptyState.classList.remove('hidden');
        if (emptyMessage) {
            emptyMessage.textContent = activeFilter === 'favorites'
                ? `You haven't saved any favorite recipes yet. Click the heart icon on any recipe to save it here.`
                : query 
                    ? `Try another recipe, ingredient or cuisine.`
                    : `Nothing delicious yet. Try another search query.`;
        }
    }
    if (resultsCount) resultsCount.textContent = '0 recipes';
};

const showErrorState = () => {
    hideLoadingState();
    if (allContainer) allContainer.classList.add('hidden');
    if (emptyState) emptyState.classList.add('hidden');
    if (errorState) errorState.classList.remove('hidden');
    if (resultsCount) resultsCount.textContent = '0 recipes';
};

/**
 * Fetch Meal Data from TheMealDB API
 * Exact API URL logic preserved
 */
const fetchMealData = async (query = 'chicken') => {
    currentQuery = query;
    activeFilter = 'all';
    if (showAllBtn) showAllBtn.classList.add('active');
    if (showFavBtn) showFavBtn.classList.remove('active');

    showLoadingState();

    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query)}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();

        if (!data.meals || data.meals.length === 0) {
            currentMeals = [];
            showEmptyState(query);
        } else {
            currentMeals = data.meals;
            displayMeals(currentMeals, query);
            triggerToast(`Recipe found — We found ${currentMeals.length} delicious recipe${currentMeals.length > 1 ? 's' : ''} for you.`);
        }
    } catch (error) {
        console.error('Error fetching meal data:', error);
        showErrorState();
    }
};

/**
 * Display Meals Grid in Editorial Layout
 * Preserves DOM structure compatibility (.chicken-list, .card, .name, .method, .ingredients)
 */
const displayMeals = (meals, query = currentQuery) => {
    hideLoadingState();
    if (emptyState) emptyState.classList.add('hidden');
    if (errorState) errorState.classList.add('hidden');

    if (resultsTitle) {
        resultsTitle.textContent = activeFilter === 'favorites' 
            ? 'Your Saved Favorites'
            : (query ? `Recipes for "${query}"` : 'Worth making tonight');
    }
    if (resultsCount) {
        resultsCount.textContent = `${meals.length} ${meals.length === 1 ? 'recipe' : 'recipes'}`;
    }

    allContainer.innerHTML = '';

    meals.forEach((meal, index) => {
        const chickenList = document.createElement('div');
        chickenList.classList.add('chicken-list');
        chickenList.style.animationDelay = `${index * 0.08}s`;

        // Asymmetric layout: 1st recipe is a featured hero card if 2 or more results exist
        const isFeatured = index === 0 && meals.length > 1 && activeFilter === 'all';
        if (isFeatured) {
            chickenList.classList.add('featured-item');
        }

        const card = document.createElement('div');
        card.classList.add('card');
        if (isFeatured) card.classList.add('featured-card');

        // Image Wrapper
        const imageWrapper = document.createElement('div');
        imageWrapper.classList.add('card-image-wrapper');

        const mealImage = document.createElement('img');
        mealImage.src = meal.strMealThumb;
        mealImage.alt = meal.strMeal;
        mealImage.loading = 'lazy';
        imageWrapper.appendChild(mealImage);

        // Favorite Heart Button
        const favoriteBtn = document.createElement('button');
        favoriteBtn.className = `btn-favorite ${isMealFavorite(meal.idMeal) ? 'is-favorite' : ''}`;
        favoriteBtn.setAttribute('aria-label', 'Toggle favorite recipe');
        favoriteBtn.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
        `;
        favoriteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleFavorite(meal);
        });
        imageWrapper.appendChild(favoriteBtn);

        // Category & Area Badges
        const badgeContainer = document.createElement('div');
        badgeContainer.classList.add('card-badge-container');

        if (meal.strCategory) {
            const catBadge = document.createElement('span');
            catBadge.classList.add('category-badge');
            catBadge.textContent = meal.strCategory;
            badgeContainer.appendChild(catBadge);
        }
        if (meal.strArea) {
            const areaBadge = document.createElement('span');
            areaBadge.classList.add('area-badge');
            areaBadge.textContent = meal.strArea;
            badgeContainer.appendChild(areaBadge);
        }
        imageWrapper.appendChild(badgeContainer);
        card.appendChild(imageWrapper);

        // Card Body
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        const mealName = document.createElement('h2');
        mealName.classList.add('name');
        mealName.textContent = meal.strMeal;
        cardBody.appendChild(mealName);

        const mealMethod = document.createElement('p');
        mealMethod.classList.add('method');
        const instructionExcerpt = meal.strInstructions 
            ? meal.strInstructions.substring(0, isFeatured ? 180 : 110).replace(/\n/g, ' ') + '...'
            : 'Click to explore ingredients and step-by-step instructions.';
        mealMethod.textContent = instructionExcerpt;
        cardBody.appendChild(mealMethod);

        // Top Ingredients Preview
        const ingredientList = document.createElement('ul');
        ingredientList.classList.add('ingredients');
        let ingCount = 0;
        for (let i = 1; i <= 20; i++) {
            const ing = meal[`strIngredient${i}`];
            const measure = meal[`strMeasure${i}`];
            if (ing && ing.trim() && ingCount < (isFeatured ? 5 : 3)) {
                const ingredientItem = document.createElement('li');
                ingredientItem.textContent = measure && measure.trim() ? `${ing} (${measure.trim()})` : ing;
                ingredientList.appendChild(ingredientItem);
                ingCount++;
            }
        }
        cardBody.appendChild(ingredientList);

        // Card Footer CTA
        const cardFooter = document.createElement('div');
        cardFooter.classList.add('card-footer');

        const viewBtn = document.createElement('button');
        viewBtn.classList.add('btn-view-recipe');
        viewBtn.innerHTML = `
            <span>Discover recipe</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        `;
        viewBtn.addEventListener('click', () => openMealModal(meal));
        cardFooter.appendChild(viewBtn);

        if (meal.strYoutube) {
            const watchVideoLink = document.createElement('a');
            watchVideoLink.href = meal.strYoutube;
            watchVideoLink.target = '_blank';
            watchVideoLink.rel = 'noopener noreferrer';
            watchVideoLink.innerHTML = `Video`;
            cardFooter.appendChild(watchVideoLink);
        }

        cardBody.appendChild(cardFooter);
        card.appendChild(cardBody);
        chickenList.appendChild(card);
        allContainer.appendChild(chickenList);
    });
};

const renderFavoritesView = () => {
    activeFilter = 'favorites';
    if (showAllBtn) showAllBtn.classList.remove('active');
    if (showFavBtn) showFavBtn.classList.add('active');

    const favs = getFavorites();
    if (favs.length === 0) {
        showEmptyState('');
    } else {
        displayMeals(favs, '');
    }
};

/**
 * Open Recipe Quick View / Full Detail Modal
 */
const openMealModal = (meal) => {
    if (!modalContent || !modalBackdrop) return;

    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        const ing = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        if (ing && ing.trim()) {
            ingredients.push({
                name: ing.trim(),
                measure: measure ? measure.trim() : ''
            });
        }
    }

    const rawInstructions = meal.strInstructions || '';
    const steps = rawInstructions
        .split(/\r?\n/)
        .map(step => step.trim())
        .filter(step => step.length > 0);

    modalContent.innerHTML = `
        <div class="modal-hero">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <div class="modal-hero-overlay">
                <div class="modal-badges">
                    ${meal.strCategory ? `<span class="category-badge">${meal.strCategory}</span>` : ''}
                    ${meal.strArea ? `<span class="area-badge">${meal.strArea}</span>` : ''}
                </div>
                <h2 class="modal-meal-name" id="modal-meal-name">${meal.strMeal}</h2>
            </div>
        </div>

        <div class="modal-body-container">
            <div class="modal-actions-bar">
                <div style="font-weight:600; color:var(--text-muted); font-size:0.92rem;">
                    ${ingredients.length} Fresh Ingredients • ${steps.length} Preparation Steps
                </div>
                ${meal.strYoutube ? `
                    <a href="${meal.strYoutube}" target="_blank" rel="noopener noreferrer" class="modal-video-btn">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                        Watch Video Tutorial
                    </a>
                ` : ''}
            </div>

            <div class="modal-grid">
                <div>
                    <h3 class="modal-section-title">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                        Ingredients
                    </h3>
                    <ul class="ingredients-checklist">
                        ${ingredients.map((item, index) => `
                            <li class="ingredient-item">
                                <input type="checkbox" id="modal-ing-${index}" class="ingredient-checkbox">
                                <label for="modal-ing-${index}" class="ingredient-text">${item.name}</label>
                                ${item.measure ? `<span class="ingredient-measure">${item.measure}</span>` : ''}
                            </li>
                        `).join('')}
                    </ul>
                </div>

                <div>
                    <h3 class="modal-section-title">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                        Cooking Instructions
                    </h3>
                    <div class="instructions-steps">
                        ${steps.map((stepText, index) => `
                            <div class="step-card">
                                <div class="step-number">${String(index + 1).padStart(2, '0')}</div>
                                <div class="step-text">${stepText}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;

    modalBackdrop.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
};

const closeMealModal = () => {
    if (!modalBackdrop) return;
    modalBackdrop.classList.add('hidden');
    document.body.style.overflow = '';
};

// Delayed Newsletter Popup Logic
const initNewsletterPopup = () => {
    const DISMISSED_KEY = 'fatimas_kitchen_newsletter_dismissed';
    if (sessionStorage.getItem(DISMISSED_KEY)) return;

    setTimeout(() => {
        if (newsletterModalBackdrop && !sessionStorage.getItem(DISMISSED_KEY)) {
            newsletterModalBackdrop.classList.remove('hidden');
        }
    }, 7000);

    const closeNewsletter = () => {
        if (newsletterModalBackdrop) {
            newsletterModalBackdrop.classList.add('hidden');
            sessionStorage.setItem(DISMISSED_KEY, 'true');
        }
    };

    if (newsletterCloseBtn) {
        newsletterCloseBtn.addEventListener('click', closeNewsletter);
    }
    if (newsletterModalBackdrop) {
        newsletterModalBackdrop.addEventListener('click', (e) => {
            if (e.target === newsletterModalBackdrop) closeNewsletter();
        });
    }
    if (newsletterPopupForm) {
        newsletterPopupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for subscribing to Fatima’s Kitchen!');
            closeNewsletter();
        });
    }
};

// Scroll Reveal Observer
const initScrollReveal = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));
};

// Event Listeners Initialization
const initEventListeners = () => {
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const query = searchInput ? searchInput.value.trim() : '';
            if (query) {
                fetchMealData(query);
            }
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', () => {
            if (clearSearchBtn) {
                if (searchInput.value.trim().length > 0) {
                    clearSearchBtn.classList.remove('hidden');
                } else {
                    clearSearchBtn.classList.add('hidden');
                }
            }
        });
    }

    if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', () => {
            if (searchInput) {
                searchInput.value = '';
                clearSearchBtn.classList.add('hidden');
                searchInput.focus();
            }
            fetchMealData('chicken');
        });
    }

    tagPills.forEach(pill => {
        pill.addEventListener('click', () => {
            tagPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            const query = pill.getAttribute('data-query');
            if (searchInput) {
                searchInput.value = query;
                if (clearSearchBtn) clearSearchBtn.classList.remove('hidden');
            }
            fetchMealData(query);
        });
    });

    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const cat = card.getAttribute('data-category');
            if (cat) {
                if (searchInput) searchInput.value = cat;
                const recipesSec = document.getElementById('recipes-section');
                if (recipesSec) recipesSec.scrollIntoView({ behavior: 'smooth' });
                fetchMealData(cat);
            }
        });
    });

    // Favorites Filter Controls
    if (showAllBtn) {
        showAllBtn.addEventListener('click', () => {
            activeFilter = 'all';
            showAllBtn.classList.add('active');
            if (showFavBtn) showFavBtn.classList.remove('active');
            displayMeals(currentMeals, currentQuery);
        });
    }

    if (showFavBtn) {
        showFavBtn.addEventListener('click', renderFavoritesView);
    }

    if (favoritesTabBtn) {
        favoritesTabBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const section = document.getElementById('recipes-section');
            if (section) section.scrollIntoView({ behavior: 'smooth' });
            renderFavoritesView();
        });
    }

    const mobileFavBtn = document.getElementById('mobile-favorites-btn');
    if (mobileFavBtn) {
        mobileFavBtn.addEventListener('click', () => {
            if (mobileMenu) mobileMenu.classList.remove('active');
            renderFavoritesView();
        });
    }

    // Reset & Retry Buttons
    if (emptyResetBtn) {
        emptyResetBtn.addEventListener('click', () => {
            if (searchInput) searchInput.value = '';
            fetchMealData('chicken');
        });
    }

    if (errorRetryBtn) {
        errorRetryBtn.addEventListener('click', () => {
            fetchMealData(currentQuery || 'chicken');
        });
    }

    // Modal Events
    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeMealModal);
    if (modalBackdrop) {
        modalBackdrop.addEventListener('click', (e) => {
            if (e.target === modalBackdrop) closeMealModal();
        });
    }

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeMealModal();
            if (newsletterModalBackdrop) newsletterModalBackdrop.classList.add('hidden');
        }
    });

    // Inline Newsletter Form Submit
    if (inlineNewsletterForm) {
        inlineNewsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for subscribing to Fatima’s Kitchen inspiration newsletter!');
            inlineNewsletterForm.reset();
        });
    }

    // Mobile Menu Toggle
    if (mobileToggle && mobileMenu) {
        mobileToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
        });
    }
};

// Initialize App
updateFavoritesBadges();
initEventListeners();
initScrollReveal();
initNewsletterPopup();
fetchMealData('chicken');