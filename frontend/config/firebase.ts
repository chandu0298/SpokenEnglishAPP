import "react-native-get-random-values";
import { initializeApp } from "firebase/app";
import { initializeAuth } from "firebase/auth";
import { getReactNativePersistence } from "@firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

// EchoFluent Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCA51PEE8R8zrCJVthdHel8Qe6bh7lRqJQ",
  authDomain: "spokenenglishapp-21f25.firebaseapp.com",
  projectId: "spokenenglishapp-21f25",
  storageBucket: "spokenenglishapp-21f25.firebasestorage.app",
  messagingSenderId: "336217796249",
  appId: "1:336217796249:web:39fe1fc7d14816c99cd208",
  measurementId: "G-RSTKT0ZRH1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with persistence for React Native
// This prevents the search for browser-only elements like 'getElementsByTagName'
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});