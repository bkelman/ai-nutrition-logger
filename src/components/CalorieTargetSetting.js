// src/components/CalorieTargetSetting.js
import React, { useState } from 'react';
import { updateCalorieTarget } from '../services/userSettingsService';

function CalorieTargetSetting({ currentTarget, userId, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newTarget, setNewTarget] = useState(currentTarget);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTarget || isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      await updateCalorieTarget(userId, parseInt(newTarget));
      onUpdate(parseInt(newTarget));
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update calorie target:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isEditing) {
    return (
      <div className="mb-4 flex justify-between items-center">
        <div>
          <span className="text-sm font-medium text-gray-700">Daily Calorie Target:</span>
          <span className="ml-2 font-bold">{currentTarget}</span>
        </div>
        <button
          onClick={() => setIsEditing(true)}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Edit
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="flex items-center">
        <label htmlFor="calorie-target" className="text-sm font-medium text-gray-700 mr-2">
          Daily Calorie Target:
        </label>
        <input
          id="calorie-target"
          type="number"
          min="500"
          max="10000"
          value={newTarget}
          onChange={(e) => setNewTarget(e.target.value)}
          className="border rounded px-2 py-1 w-24 text-center"
        />
        <div className="ml-2 space-x-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="text-sm bg-blue-600 text-white px-2 py-1 rounded"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => {
              setIsEditing(false);
              setNewTarget(currentTarget);
            }}
            className="text-sm border border-gray-300 px-2 py-1 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}

export default CalorieTargetSetting;