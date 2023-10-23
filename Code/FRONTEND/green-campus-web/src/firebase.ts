import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAZ4Ce8G0WK9ElAtz5sNeMAwygI4yntNlI",
  authDomain: "resonant-goods-402508.firebaseapp.com",
  projectId: "resonant-goods-402508",
  storageBucket: "resonant-goods-402508.appspot.com",
  messagingSenderId: "701411291905",
  appId: "1:701411291905:web:45f285ed6b33c5f788a100",
  measurementId: "G-9KJNECK2CX"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };