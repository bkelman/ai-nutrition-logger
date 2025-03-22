import React from 'react';

function NutritionDisplay({ meal }) {
  if (!meal) return null;

  return (
    <div className="mb-8 p-4 bg-white border rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Nutrition Analysis</h2>
      <div className="mb-4">
        <h3 className="font-medium">You ate: {meal.description}</h3>
        <p className="text-sm text-gray-600">
          {new Date(meal.timestamp).toLocaleString()}
        </p>
      </div>

      <div className="mb-4">
        <h3 className="font-medium mb-2">Food Items:</h3>
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="inline-block min-w-full sm:px-0 px-4">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-2 sm:px-4 text-left text-xs sm:text-sm">Item</th>
                  <th className="py-2 px-2 sm:px-4 text-left text-xs sm:text-sm">Portion</th>
                  <th className="py-2 px-2 sm:px-4 text-right text-xs sm:text-sm">Calories</th>
                  <th className="py-2 px-2 sm:px-4 text-right text-xs sm:text-sm">Protein (g)</th>
                  <th className="py-2 px-2 sm:px-4 text-right text-xs sm:text-sm">Carbs (g)</th>
                  <th className="py-2 px-2 sm:px-4 text-right text-xs sm:text-sm">Fat (g)</th>
                </tr>
              </thead>
              <tbody>
                {meal.items.map((item, index) => (
                  <tr key={index} className="border-t">
                    <td className="py-2 px-2 sm:px-4 text-xs sm:text-sm">{item.name}</td>
                    <td className="py-2 px-2 sm:px-4 text-xs sm:text-sm">{item.portion}</td>
                    <td className="py-2 px-2 sm:px-4 text-right text-xs sm:text-sm">{item.calories}</td>
                    <td className="py-2 px-2 sm:px-4 text-right text-xs sm:text-sm">{item.protein}</td>
                    <td className="py-2 px-2 sm:px-4 text-right text-xs sm:text-sm">{item.carbs}</td>
                    <td className="py-2 px-2 sm:px-4 text-right text-xs sm:text-sm">{item.fat}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50 font-medium">
                <tr>
                  <td className="py-2 px-2 sm:px-4 text-xs sm:text-sm" colSpan="2">Totals</td>
                  <td className="py-2 px-2 sm:px-4 text-right text-xs sm:text-sm">{meal.totals.calories}</td>
                  <td className="py-2 px-2 sm:px-4 text-right text-xs sm:text-sm">{meal.totals.protein}</td>
                  <td className="py-2 px-2 sm:px-4 text-right text-xs sm:text-sm">{meal.totals.carbs}</td>
                  <td className="py-2 px-2 sm:px-4 text-right text-xs sm:text-sm">{meal.totals.fat}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NutritionDisplay;