import firebase from "firebase";
import "firebase/firestore";

const config = {
  apiKey: "AIzaSyCYC4F66N57djADFvaz5i30cAaYVzWqq1o",
  authDomain: "recipes-ebe53.firebaseapp.com",
  databaseURL: "https://recipes-ebe53.firebaseio.com",
  messagingSenderId: "322081152196",
  projectId: "recipes-ebe53",
  storageBucket: "recipes-ebe53.appspot.com"
};

firebase.initializeApp(config);

const provider = new firebase.auth.GoogleAuthProvider();

export const login = () => {
  return firebase
    .auth()
    .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .then(() => firebase.auth().signInWithPopup(provider))
    .catch(error => {
      // TODO
    });
};

export const logout = () => {
  return firebase.auth().signOut();
};

// this collection stores recipes associated to ingredients
export const INGREDIENTS_COLLECTION = "ingredients";
// this collection stores only ingredients
export const INGREDIENTS_LIST_COLLECTION = "references";
// this collections stores recipes and ingredients
export const RECIPES_COLLECTION = "recipes";
export const database = firebase.firestore();
