// src/services/userSettingsService.js
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

// Get user settings
export const getUserSettings = async (userId) => {
  try {
    const settingsRef = doc(db, 'userSettings', userId);
    const settingsSnap = await getDoc(settingsRef);
    
    if (settingsSnap.exists()) {
      return settingsSnap.data();
    } else {
      // Create default settings if none exist
      const defaultSettings = {
        calorieTarget: 2000, // Default value
        createdAt: new Date()
      };
      
      await setDoc(settingsRef, defaultSettings);
      return defaultSettings;
    }
  } catch (error) {
    console.error('Error getting user settings:', error);
    return { calorieTarget: 2000 }; // Fallback default
  }
};

// Update calorie target
export const updateCalorieTarget = async (userId, calorieTarget) => {
  try {
    const settingsRef = doc(db, 'userSettings', userId);
    await updateDoc(settingsRef, { 
      calorieTarget,
      updatedAt: new Date()
    });
    return true;
  } catch (error) {
    console.error('Error updating calorie target:', error);
    throw error;
  }
};