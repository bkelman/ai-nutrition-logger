// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBBT0o-O0gC9A3RlRecc4L5YfnHATGCgxI",
  authDomain: "ai-nutrition-logger.firebaseapp.com",
  projectId: "ai-nutrition-logger",
  storageBucket: "ai-nutrition-logger.firebasestorage.app",
  messagingSenderId: "347512920796",
  appId: "1:347512920796:web:327d5fb86143a842587219",
  measurementId: "G-K8002RZZC5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
const analytics = getAnalytics(app);

export default app;