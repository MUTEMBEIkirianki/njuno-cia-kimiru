import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAle5rvP4kz2sSExNn2haXpZhHOVru6DA4",
  authDomain: "njuno-cia-kimiru.firebaseapp.com",
  projectId: "njuno-cia-kimiru",
  storageBucket: "njuno-cia-kimiru.firebasestorage.app",
  messagingSenderId: "759849242337",
  appId: "1:759849242337:web:f54d01048f3917e72571a0"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);