import { initializeApp } from 'firebase/app';
import { getAuth, } from 'firebase/auth';
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDUqvKR_em9duxRWbNLH8oFEm2fL2CGX0E",
  authDomain: "kyc-dvo-465408.firebaseapp.com",
  projectId: "kyc-dvo-465408",
  storageBucket: "kyc-dvo-465408.firebasestorage.app",
  messagingSenderId: "149431048681",
  appId: "1:149431048681:web:1bf6a864573c8cd3355378",
  measurementId: "G-2PHQKTLPVM"
};

const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth = getAuth(app);