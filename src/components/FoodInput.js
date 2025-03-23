// src/components/FoodInput.js - Update button text from "Log Food" to "Submit"

import React, { useState } from 'react';
import { analyzeFoodDescription } from '../services/openai';
import VoiceInput from './VoiceInput';

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
      await addMeal(mealData);
      setDescription('');
    } catch (err) {
      setError('Failed to analyze food. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleTranscriptChange = (transcript) => {
    setDescription(prevDescription => {
      if (prevDescription.trim()) {
        return prevDescription + ' ' + transcript;
      }
      return transcript;
    });
  };

  return (
    <div className="mb-6 p-4 bg-white border rounded-lg shadow">
      <form onSubmit={handleSubmit}>
        <textarea
          className="w-full p-3 border rounded"
          rows="2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What did you eat or drink?"
          disabled={loading}
        ></textarea>
        
        <div className="flex justify-center space-x-2 mt-3">
          <VoiceInput onTranscriptChange={handleTranscriptChange} />
          <button
            type="submit"
            className="bg-red-600 text-white px-4 py-2 rounded"
            disabled={loading || !description.trim()}
          >
            {loading ? 'Analyzing...' : 'Submit'}
          </button>
        </div>
        {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
      </form>
    </div>
  );
}

export default FoodInput;