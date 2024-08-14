// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-363b7.firebaseapp.com",
  projectId: "mern-blog-363b7",
  storageBucket: "mern-blog-363b7.appspot.com",
  messagingSenderId: "597205346166",
  appId: "1:597205346166:web:262ca1f0c33e2a11463c57"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);