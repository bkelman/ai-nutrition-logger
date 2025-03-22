import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import FoodInput from './components/FoodInput';
import NutritionDisplay from './components/NutritionDisplay';
import DailySummary from './components/DailySummary';
import { saveMeal, getUserMeals } from './services/mealService';

function App() {
  const [meals, setMeals] = useState([]);
  const [currentMeal, setCurrentMeal] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user's meals for today
  useEffect(() => {
    const loadMeals = async () => {
      try {
        setLoading(true);
        const userMeals = await getUserMeals();
        setMeals(userMeals);
      } catch (error) {
        console.error('Error loading meals:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadMeals();
  }, []);

  // Add a new meal
  const addMeal = async (meal) => {
    try {
      const mealId = await saveMeal(meal);
      const mealWithId = { ...meal, id: mealId };
      setMeals([mealWithId, ...meals]);
    } catch (error) {
      console.error('Error adding meal:', error);
    }
  };

  return (
    <div className="App">
      <Header />
      <main className="container mx-auto p-4">
        <FoodInput setCurrentMeal={setCurrentMeal} addMeal={addMeal} />
        {currentMeal && <NutritionDisplay meal={currentMeal} />}
        {loading ? (
          <p>Loading your meal history...</p>
        ) : (
          <DailySummary meals={meals} />
        )}
      </main>
    </div>
  );
}

export default App;