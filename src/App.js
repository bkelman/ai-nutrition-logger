import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import FoodInput from './components/FoodInput';
import NutritionDisplay from './components/NutritionDisplay';
import DailySummary from './components/DailySummary';

function App() {
  const [meals, setMeals] = useState([]);
  const [currentMeal, setCurrentMeal] = useState(null);

  // Add a new meal to the meals list
  const addMeal = (meal) => {
    setMeals([...meals, meal]);
  };

  return (
    <div className="App">
      <Header />
      <main className="container mx-auto p-4">
        <FoodInput setCurrentMeal={setCurrentMeal} addMeal={addMeal} />
        {currentMeal && <NutritionDisplay meal={currentMeal} />}
        <DailySummary meals={meals} />
      </main>
    </div>
  );
}

export default App;