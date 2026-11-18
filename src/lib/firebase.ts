import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBmYYn0GHaEZFXEH0tRzS8RYtyc7fXqPp8",
  authDomain: "serviway.firebaseapp.com",
  projectId: "serviway",
  storageBucket: "serviway.firebasestorage.app",
  messagingSenderId: "468330108974",
  appId: "1:468330108974:web:99e5033d15552a9dbca7bf",
  measurementId: "G-0B4ELZS5F9",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);
export default app;
