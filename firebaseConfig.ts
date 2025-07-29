
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAjOm9OZr3H6-_51uwkmoKyq84bY3C85yU",
  authDomain: "adhd-quest-app.firebaseapp.com",
  projectId: "adhd-quest-app",
  storageBucket: "adhd-quest-app.firebasestorage.app",
  messagingSenderId: "703837762344",
  appId: "1:703837762344:web:b7a2437cea05f8fa21161d",
  measurementId: "G-Y1ZW26T3C5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };