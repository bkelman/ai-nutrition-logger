import { db } from '../firebase';
import { collection, addDoc, query, where, getDocs, orderBy, Timestamp } from 'firebase/firestore';

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

// Get all meals for a user, ordered by timestamp
export const getUserMeals = async (userId) => {
  if (!userId) return [];
  
  try {
    const mealsRef = collection(db, 'meals');
    const q = query(
      mealsRef,
      where('userId', '==', userId),
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