import React, { useMemo } from 'react';

function DailySummary({ meals, date }) {
  // Format the date
  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

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

  return (
    <div className="mb-8 p-4 bg-white border rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-2">Summary for {formattedDate}</h2>
      
      {!meals.length ? (
        <div className="p-4 bg-gray-50 text-center rounded">
          <p>No meals logged for this date.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-100 p-4 rounded text-center">
              <h3 className="font-medium text-blue-800">Calories</h3>
              <p className="text-2xl font-bold">{Math.round(dailyTotals.calories)}</p>
            </div>
            <div className="bg-red-100 p-4 rounded text-center">
              <h3 className="font-medium text-red-800">Protein</h3>
              <p className="text-2xl font-bold">{Math.round(dailyTotals.protein)}g</p>
            </div>
            <div className="bg-yellow-100 p-4 rounded text-center">
              <h3 className="font-medium text-yellow-800">Carbs</h3>
              <p className="text-2xl font-bold">{Math.round(dailyTotals.carbs)}g</p>
            </div>
            <div className="bg-green-100 p-4 rounded text-center">
              <h3 className="font-medium text-green-800">Fat</h3>
              <p className="text-2xl font-bold">{Math.round(dailyTotals.fat)}g</p>
            </div>
          </div>
          
          <h3 className="font-medium mb-2">Meals</h3>
          <div className="space-y-2">
            {meals.map((meal, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded">
                <p className="font-medium">{meal.description}</p>
                <p className="text-sm text-gray-600">
                  {new Date(meal.timestamp).toLocaleTimeString()} • 
                  {meal.totals.calories} calories
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default DailySummary;