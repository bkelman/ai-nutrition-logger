import { db } from '../firebase';
import { collection, addDoc, query, where, getDocs, orderBy, Timestamp, doc, deleteDoc } from 'firebase/firestore';

// Save a new meal to Firestore
export const saveMeal = async (mealData, userId) => {
  try {
    const mealsRef = collection(db, 'meals');
    const mealWithMetadata = {
      ...mealData,
      userId,
      createdAt: Timestamp.now()
    };
    
    const docRef = await addDoc(mealsRef, mealWithMetadata);
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
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp || doc.data().createdAt?.toDate().toISOString() || new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error getting user meals:', error);
      return [];
    }
  };

  // Deleting a meal from Firestore
export const deleteMeal = async (mealId) => {
    try {
      const mealRef = doc(db, 'meals', mealId);
      await deleteDoc(mealRef);
      return true;
    } catch (error) {
      console.error('Error deleting meal:', error);
      throw error;
    }
  };