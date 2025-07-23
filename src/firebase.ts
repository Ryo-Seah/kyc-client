import { initializeApp } from 'firebase/app';
import { getAuth, } from 'firebase/auth';
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBZjkBDG4bTotIIzKxOw28UKcNCZZbniQE",
  authDomain: "kyc-dvo-465409.firebaseapp.com",
  projectId: "kyc-dvo-465409",
  storageBucket: "kyc-dvo-465409.firebasestorage.app",
  messagingSenderId: "1095259062904",
  appId: "1:1095259062904:web:ca5bc6c7faf3daec1ce38d",
  measurementId: "G-J7N2SEG6GR"
};

const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth = getAuth(app);