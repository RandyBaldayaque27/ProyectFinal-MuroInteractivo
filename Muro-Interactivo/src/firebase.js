import firebase from "firebase/compat/app";
import 'firebase/compat/auth'
import 'firebase/compat/firestore'
import "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyB7a86x-j91njkWsvWs4cDCO5j74M0FrCE",
  authDomain: "muro-interactivo-d7920.firebaseapp.com",
  projectId: "muro-interactivo-d7920",
  storageBucket: "muro-interactivo-d7920.appspot.com",
  messagingSenderId: "440215213230",
  appId: "1:440215213230:web:80b356c51c3b18e3b0093f"
};
const storage = firebase.initializeApp(firebaseConfig);

export {storage, firebase as default}