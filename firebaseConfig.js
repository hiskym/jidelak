import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore'
import { collection } from 'firebase/firestore'
import { initializeAuth, getReactNativePersistence } from 'firebase/auth'
import AsyncStorage from '@react-native-async-storage/async-storage';

// Initialize Firebase

const firebaseConfig = {
  apiKey: "AIzaSyATW6Dj0cjDQQrwvJrCgZfR05QbVRpVqxk",
  authDomain: "jidelak-4f111.firebaseapp.com",
  projectId: "jidelak-4f111",
  storageBucket: "jidelak-4f111.appspot.com",
  messagingSenderId: "821169222736",
  appId: "1:821169222736:web:de0d5569bc72b2eb424d55"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export const recipesRef = collection(db, "recipes");
export const usersRef = collection(db, 'users');
export const mealsRef = collection(db, 'meals')
export const favoritesRef = collection(db, 'favorites')
export const ingredientsRef = collection(db, 'ingredients');
export const recipeIngredientsRef = collection(db, 'recipeIngredients')
export const cartsRef = collection(db, 'carts')
export const FIREBASE_AUTH = auth;
