const fetchMealData = async () => {
    try {
      const response = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=chicken');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      displayMeals(data.meals);
    } catch (error) {
      console.error('Error fetching meal data:', error);
    }
  };
  
  const displayMeals = (meals) => {
    const allContainer = document.getElementById('all');
    allContainer.innerHTML = ''; 
  
    meals.forEach(meal => {
    
      const chickenList = document.createElement('div');
      chickenList.classList.add('chicken-list');
  
      
      const card = document.createElement('div');
      card.classList.add('card');
  
      
      const mealImage = document.createElement('img');
      mealImage.src = meal.strMealThumb;
      mealImage.alt = meal.strMeal;
      card.appendChild(mealImage);
  
      
      const mealName = document.createElement('h2');
      mealName.classList.add('name');
      mealName.textContent = meal.strMeal;
      card.appendChild(mealName);
  
      
      const mealMethod = document.createElement('p');
      mealMethod.classList.add('method');
      mealMethod.innerHTML = meal.strInstructions.substring(0, 100).replace(/\n/g, '<br>') + '...';
      card.appendChild(mealMethod);
  
      
      const ingredientList = document.createElement('ul');
      ingredientList.classList.add('ingredients');
      for (let i = 1; i <= 5; i++) { 
        if (meal[`strIngredient${i}`]) {
          const ingredientItem = document.createElement('li');
          ingredientItem.textContent = `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`;
          ingredientList.appendChild(ingredientItem);
        }
      }
      card.appendChild(ingredientList);

      const watchVideoLink = document.createElement('a');
      watchVideoLink.href = meal.strYoutube;
      watchVideoLink.target = '_blank';
      watchVideoLink.textContent = 'Watch Video';
      card.appendChild(watchVideoLink);
  
      
      chickenList.appendChild(card);
      allContainer.appendChild(chickenList);
    });
  };
  
  
  fetchMealData();
  