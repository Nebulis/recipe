import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  setPersistence,
  browserLocalPersistence
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const config = {
  apiKey: "AIzaSyCYC4F66N57djADFvaz5i30cAaYVzWqq1o",
  authDomain: "recipes-ebe53.firebaseapp.com",
  databaseURL: "https://recipes-ebe53.firebaseio.com",
  messagingSenderId: "322081152196",
  projectId: "recipes-ebe53",
  storageBucket: "recipes-ebe53.appspot.com"
};

const app = initializeApp(config);
const auth = getAuth();

const provider = new GoogleAuthProvider();

export const login = () => {
  return setPersistence(auth, browserLocalPersistence)
    .then(() => signInWithPopup(auth, provider))
    .catch((error: unknown) => {
      console.log(error);
    });
};

export const logout = () => {
  return signOut(auth);
};

// this collection stores recipes associated to ingredients
export const INGREDIENTS_COLLECTION = "ingredients";
// this collection stores only ingredients
export const INGREDIENTS_LIST_COLLECTION = "references";
// this collections stores recipes and ingredients
export const RECIPES_COLLECTION = "recipes";
export const database = getFirestore(app);
