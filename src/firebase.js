// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCQ1Rb5RZDAk9e5OywcjR0ONpjfXaSUo4U",
  authDomain: "manageruser-19ca4.firebaseapp.com",
  projectId: "manageruser-19ca4",
  storageBucket: "manageruser-19ca4.appspot.com",
  messagingSenderId: "104014704010",
  appId: "1:104014704010:android:b3d2378defeb8c77b1ec73",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
