// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ,
  authDomain: "real-estate-64399.firebaseapp.com",
  projectId: "real-estate-64399",
  storageBucket: "real-estate-64399.appspot.com",
  messagingSenderId: "10115832735",
  appId: "1:10115832735:web:bb0baabb66e5bab0b6bbaa"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);