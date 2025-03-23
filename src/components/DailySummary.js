// src/components/DailySummary.js
import React, { useMemo, useState } from 'react';
import { deleteMeal } from '../services/mealService';

function DailySummary({ meals, date, onMealDeleted, showMealsList = true }) {
  const [deletingId, setDeletingId] = useState(null);
  
  // Calculate daily totals
  const dailyTotals = useMemo(() => {
    if (!meals.length) return { calories: 0, protein: 0, carbs: 0, fat: 0 };
    
    return meals.reduce(
      (acc, meal) => {
        return {
          calories: acc.calories + meal.totals.calories,
          protein: acc.protein + meal.totals.protein,
          carbs: acc.carbs + meal.totals.carbs,
          fat: acc.fat + meal.totals.fat
        };
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  }, [meals]);

  const handleDeleteMeal = async (mealId) => {
    try {
      setDeletingId(mealId);
      await deleteMeal(mealId);
      if (onMealDeleted) {
        onMealDeleted(mealId);
      }
    } catch (error) {
      console.error('Error deleting meal:', error);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mb-4 p-3 bg-white border rounded-lg shadow">
      {/* Compact stats row */}
      <div className="flex justify-between items-center text-sm">
        <div className="flex items-center">
          <span className="font-medium">Today:</span>
          <span className="ml-2 px-2 py-1 bg-blue-100 rounded text-blue-800">
            {Math.round(dailyTotals.calories)} cal
          </span>
        </div>
        
        <div className="flex space-x-2">
          <span className="px-2 py-1 bg-red-100 rounded text-red-800">
            {Math.round(dailyTotals.protein)}<span className="font-normal">g</span> protein
          </span>
          <span className="px-2 py-1 bg-yellow-100 rounded text-yellow-800">
            {Math.round(dailyTotals.carbs)}<span className="font-normal">g</span> carbs
          </span>
          <span className="px-2 py-1 bg-green-100 rounded text-green-800">
            {Math.round(dailyTotals.fat)}<span className="font-normal">g</span> fat
          </span>
        </div>
      </div>
      
      {/* Only show meals list if showMealsList is true */}
      {showMealsList && (
        <>
          <h3 className="font-medium mt-4 mb-2">Meals</h3>
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
                    onClick={() => handleDeleteMeal(meal.id)}
                    disabled={deletingId === meal.id}
                    className="text-red-500 p-1 ml-2 rounded hover:bg-gray-200 flex-shrink-0"
                    aria-label="Delete meal"
                  >
                    {deletingId === meal.id ? (
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    )}
                  </button>
                </div>
              ))
            ) : (
              <div className="p-4 bg-gray-50 text-center rounded">
                <p>No meals logged for this date.</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default DailySummary;