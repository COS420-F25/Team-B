// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCXn2WaTCHZEy130v_tXQ3XptT7HfaceAM",
  authDomain: "gogy-ed242.firebaseapp.com",
  projectId: "gogy-ed242",
  storageBucket: "gogy-ed242.firebasestorage.app",
  messagingSenderId: "469501458062",
  appId: "1:469501458062:web:93a212797a3a8b18623bdf",
  measurementId: "G-L2BZQTQBWM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();