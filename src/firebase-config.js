// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyChdkwWIOHhprTvGsDei6o2Vas__TL6T-k",
  authDomain: "documentretrieval.firebaseapp.com",
  projectId: "documentretrieval",
  storageBucket: "documentretrieval.appspot.com",
  messagingSenderId: "941549675691",
  appId: "1:941549675691:web:cabee24c8ea6556b9403ee",
  measurementId: "G-QNNH2DCN0X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);