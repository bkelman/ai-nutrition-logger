// src/services/mealService.js
import { 
    collection, 
    addDoc, 
    query, 
    where, 
    getDocs, 
    orderBy, 
    Timestamp, 
    doc, 
    deleteDoc
  } from 'firebase/firestore';
  import { getAuth } from 'firebase/auth';
  import { db } from '../firebase';
  
  // Save a new meal to Firestore
  export const saveMeal = async (mealData, userId) => {
    try {
      console.log('Attempting to save meal:', mealData);
      const mealsRef = collection(db, 'meals');
      const mealWithMetadata = {
        ...mealData,
        userId,
        createdAt: Timestamp.now()
      };
      
      const docRef = await addDoc(mealsRef, mealWithMetadata);
      console.log('Meal saved with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error saving meal:', error);
      throw error;
    }
  };
  
  // Get meals for a user on a specific date
  export const getUserMeals = async (userId, date = new Date()) => {
    if (!userId) return [];
    
    try {
      // Create start and end timestamps for the selected date
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      
      const startTimestamp = Timestamp.fromDate(startOfDay);
      const endTimestamp = Timestamp.fromDate(endOfDay);
      
      console.log(`Fetching meals for ${startOfDay.toDateString()}`);
      
      const mealsRef = collection(db, 'meals');
      const q = query(
        mealsRef,
        where('userId', '==', userId),
        where('createdAt', '>=', startTimestamp),
        where('createdAt', '<=', endTimestamp),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const meals = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp || doc.data().createdAt?.toDate().toISOString() || new Date().toISOString()
      }));
      
      console.log('Loaded meals:', meals);
      return meals;
    } catch (error) {
      console.error('Error getting user meals:', error);
      return [];
    }
  };
  
  // Delete a meal from Firestore
  export const deleteMeal = async (mealId) => {
    console.log(`Starting deletion process for meal ID: ${mealId}`);
    try {
      const auth = getAuth();
      if (!auth.currentUser) {
        console.error('User not authenticated during deletion attempt');
        throw new Error('Authentication required');
      }
      console.log('Current user during deletion:', auth.currentUser.uid);
      
      if (!mealId) {
        console.error('Cannot delete: mealId is undefined or null');
        throw new Error('Meal ID is required for deletion');
      }
      
      console.log(`Creating document reference for ${mealId}`);
      const mealRef = doc(db, 'meals', mealId);
      
      console.log('Attempting to delete from Firestore...');
      await deleteDoc(mealRef);
      
      console.log('Deletion successful!');
      return true;
    } catch (error) {
      console.error('Error deleting meal:', error);
      throw error;
    }
  };