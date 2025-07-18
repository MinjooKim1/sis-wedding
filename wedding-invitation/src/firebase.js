// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCa8iTzyR8evMLBahJOoIp2KxhgPuTf3pw",
  authDomain: "wedding-invitation-8ab1d.firebaseapp.com",
  projectId: "wedding-invitation-8ab1d",
  storageBucket: "wedding-invitation-8ab1d.appspot.com",
  messagingSenderId: "428909739066",
  appId: "1:428909739066:web:29e3c9cddc7ef32121c8903"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firestore DB
export const db = getFirestore(app);