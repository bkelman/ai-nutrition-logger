import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import DateSelector from './components/DateSelector';
import FoodInput from './components/FoodInput';
import NutritionDisplay from './components/NutritionDisplay';
import DailySummary from './components/DailySummary';
import AuthContainer from './components/auth/AuthContainer';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { saveMeal, getUserMeals, deleteMeal } from './services/mealService';

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
    console.log('Handling meal deletion for ID:', mealId); // Add for debugging
    setMeals(prevMeals => prevMeals.filter(meal => meal.id !== mealId));
  };

  // If not authenticated, show auth container
  if (!currentUser) {
    return <AuthContainer />;
  }

  return (
    <div className="App">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 max-w-4xl">
        {/* 1. Date Selector */}
        <DateSelector 
          selectedDate={selectedDate} 
          setSelectedDate={setSelectedDate} 
        />
        
        {/* 2. Daily Summary - Calories and Macros */}
        {!loading && (
          <DailySummary 
            meals={meals} 
            date={selectedDate} 
            onMealDeleted={handleMealDeleted} 
            showMealsList={false} // New prop to hide meals list
          />
        )}
        
        {/* 3. Food/Drink Input Box */}
        {isToday(selectedDate) && (
          <FoodInput setCurrentMeal={setCurrentMeal} addMeal={addMeal} />
        )}
        
        {/* Display analysis of current meal entry if available */}
        {currentMeal && isToday(selectedDate) && 
          <NutritionDisplay meal={currentMeal} />
        }
        
        {/* 4. Today's Meal Entries */}
        {loading ? (
          <p className="text-center py-4">Loading your meal history...</p>
        ) : (
          <div className="mt-6">
            <h3 className="font-medium mb-2">Today's Entries</h3>
            <div className="space-y-2">
              {meals.length > 0 ? (
                meals.map((meal) => (
                  <div key={meal.id} className="p-3 bg-gray-50 rounded flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium">{meal.description}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {new Date(meal.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} • 
                        {meal.totals.calories} calories
                      </p>
                    </div>
                    <button
                      onClick={async () => {
                        try {
                         // First delete from Firestore
                         await deleteMeal(meal.id);
                          // Then update local state
                           handleMealDeleted(meal.id);
                        } catch (error) {
                          console.error('Error deleting meal:', error);
                       }
                     }}
                     className="text-red-500 p-1 ml-2 rounded hover:bg-gray-200 flex-shrink-0"
                     aria-label="Delete meal"
                    >
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
</button>
                  </div>
                ))
              ) : (
                <div className="p-4 bg-gray-50 text-center rounded">
                  <p>No entries yet today. Log your first meal or drink above.</p>
                </div>
              )}
            </div>
          </div>
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