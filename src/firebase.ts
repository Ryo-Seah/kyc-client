import { initializeApp } from 'firebase/app';
import { getAuth, } from 'firebase/auth';
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDNddFXHMti2BqYSp606UBB_-6KxK2zf-o",
  authDomain: "kyc-dvo-4a167.firebaseapp.com",
  projectId: "kyc-dvo-4a167",
  storageBucket: "kyc-dvo-4a167.firebasestorage.app",
  messagingSenderId: "974355582942",
  appId: "1:974355582942:web:d6784f66551fe3e6b7974f",
  measurementId: "G-FV5H80LN0R"
};

const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth = getAuth(app);