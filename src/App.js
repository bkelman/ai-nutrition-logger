import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import DateSelector from './components/DateSelector';
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
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Load user's meals for the selected date
  useEffect(() => {
    if (!currentUser) return;
    
    const loadMeals = async () => {
      try {
        setLoading(true);
        const userMeals = await getUserMeals(currentUser.uid, selectedDate);
        setMeals(userMeals);
      } catch (error) {
        console.error('Error loading meals:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadMeals();
  }, [currentUser, selectedDate]);

  // Add a new meal
  const addMeal = async (meal) => {
    if (!currentUser) return;
    
    try {
      const mealId = await saveMeal(meal, currentUser.uid);
      const mealWithId = { ...meal, id: mealId };
      
      // Only update the meals list if the new meal is for today
      const today = new Date();
      if (isToday(selectedDate)) {
        setMeals([mealWithId, ...meals]);
      }
    } catch (error) {
      console.error('Error adding meal:', error);
    }
  };

  // Helper function to check if a date is today
  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  const handleMealDeleted = (mealId) => {
    setMeals(meals.filter(meal => meal.id !== mealId));
  };

  // If not authenticated, show auth container
  if (!currentUser) {
    return <AuthContainer />;
  }

return (
  <div className="App">
    <Header />
    <main className="container mx-auto px-4 sm:px-6 max-w-4xl">
      <DateSelector 
        selectedDate={selectedDate} 
        setSelectedDate={setSelectedDate} 
      />
      
      {isToday(selectedDate) ? (
        <FoodInput setCurrentMeal={setCurrentMeal} addMeal={addMeal} />
      ) : (
        <div className="mb-8 p-4 bg-gray-100 rounded-lg text-center">
          <p>Viewing meal history for {selectedDate.toDateString()}</p>
          <button 
            onClick={() => setSelectedDate(new Date())} 
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
          >
            Go to Today to Log New Meals
          </button>
        </div>
      )}
      
      {currentMeal && isToday(selectedDate) && <NutritionDisplay meal={currentMeal} />}
      
      {loading ? (
        <p className="text-center py-4">Loading your meal history...</p>
      ) : (
        <DailySummary 
          meals={meals} 
         date={selectedDate} 
          onMealDeleted={handleMealDeleted} 
        />
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