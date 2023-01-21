import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBqOsmAN80VO8h8IRNznpD_viyZKBUZiTI",
  authDomain: "expense-tracker-99274.firebaseapp.com",
  projectId: "expense-tracker-99274",
  storageBucket: "expense-tracker-99274.appspot.com",
  messagingSenderId: "866264782139",
  appId: "1:866264782139:web:66d2091e69028c511d931e",
  measurementId: "G-YRKPZCPMYN"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);