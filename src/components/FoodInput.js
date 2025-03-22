import React, { useState } from 'react';
import { analyzeFoodDescription } from '../services/openai';

function FoodInput({ setCurrentMeal, addMeal }) {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!description.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const mealData = await analyzeFoodDescription(description);
      setCurrentMeal(mealData);
      await addMeal(mealData); // This now saves to Firestore
      setDescription('');
    } catch (err) {
      setError('Failed to analyze food. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-8 p-4 bg-gray-100 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Log Your Food</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="food-description" className="block mb-2">
            What did you eat? (Be as specific as possible)
          </label>
          <textarea
            id="food-description"
            className="w-full p-2 border rounded"
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="E.g., I had a turkey sandwich with cheese, lettuce, and mayo on whole wheat bread"
            disabled={loading}
          ></textarea>
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={loading || !description.trim()}
        >
          {loading ? 'Analyzing...' : 'Log Food'}
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>
    </div>
  );
}

export default FoodInput;