import { db } from '../firebase';
import { collection, addDoc, query, where, getDocs, orderBy, Timestamp } from 'firebase/firestore';

// Save a new meal to Firestore
export const saveMeal = async (mealData, userId = 'anonymous') => {
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

// Get all meals for a user, ordered by timestamp
export const getUserMeals = async (userId = 'anonymous', date = new Date()) => {
  try {
    // Create start and end dates for the query (start of day to end of day)
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));
    
    const mealsRef = collection(db, 'meals');
    const q = query(
      mealsRef,
      where('userId', '==', userId),
      where('createdAt', '>=', Timestamp.fromDate(startOfDay)),
      where('createdAt', '<=', Timestamp.fromDate(endOfDay)),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting user meals:', error);
    throw error;
  }
};