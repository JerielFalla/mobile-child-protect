// lib/firebaseConfig.ts
import "react-native-get-random-values";
// lib/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your Firebase config
export const firebaseConfig = {
  apiKey: "AIzaSyDwzqIflc8_0R14WcCQGxT9CKn2ZqAj7Tw",
  authDomain: "childguard-108ed.firebaseapp.com",
  projectId: "childguard-108ed",
  storageBucket: "childguard-108ed.appspot.com",
  messagingSenderId: "6362311742",
  appId: "1:6362311742:web:02d29862c2c5a981cf756f",
};

// Initialize Firebase once
const firebaseApp = initializeApp(firebaseConfig);

// Get the auth instance
export const auth = getAuth(firebaseApp);
