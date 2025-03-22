import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import FoodInput from './components/FoodInput';
import NutritionDisplay from './components/NutritionDisplay';
import DailySummary from './components/DailySummary';
import AuthContainer from './components/auth/AuthContainer';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { saveMeal, getUserMeals } from './services/mealService';

function AppContent() {
  const { currentUser } = useAuth();
  const [meals, setMeals] = useState([]);
  const [currentMeal, setCurrentMeal] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user's meals for today
  useEffect(() => {
    if (!currentUser) return;
    
    const loadMeals = async () => {
      try {
        setLoading(true);
        const userMeals = await getUserMeals(currentUser.uid);
        setMeals(userMeals);
      } catch (error) {
        console.error('Error loading meals:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadMeals();
  }, [currentUser]);

  // Add a new meal
  const addMeal = async (meal) => {
    if (!currentUser) return;
    
    try {
      const mealId = await saveMeal(meal, currentUser.uid);
      const mealWithId = { ...meal, id: mealId };
      setMeals([mealWithId, ...meals]);
    } catch (error) {
      console.error('Error adding meal:', error);
    }
  };

  // If not authenticated, show auth container
  if (!currentUser) {
    return <AuthContainer />;
  }

  return (
    <div className="App">
      <Header />
      <main className="container mx-auto p-4">
        <FoodInput setCurrentMeal={setCurrentMeal} addMeal={addMeal} />
        {currentMeal && <NutritionDisplay meal={currentMeal} />}
        {loading ? (
          <p className="text-center py-4">Loading your meal history...</p>
        ) : (
          <DailySummary meals={meals} />
        )}
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;