import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyMockKeyForDevOnly_12345",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "medintel-hackathon.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "medintel-hackathon",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "medintel-hackathon.appspot.com",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1234567890",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1234567890:web:abcdef12345"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
