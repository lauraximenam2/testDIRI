// src/firebase-config.ts
import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getDatabase, ref } from "firebase/database";


const firebaseConfig = {
  apiKey: "AIzaSyC8ILk166rkDH77kzEYGphByUhJF_8zaao",
  authDomain: "apptenis-firebase.firebaseapp.com",
  projectId: "apptenis-firebase",
  storageBucket: "apptenis-firebase.firebasestorage.app",
  messagingSenderId: "534806375615",
  appId: "1:534806375615:web:58dd41e23e3d14c0f52a0a",
};

// Inicializar Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);

// Inicializar servicios de Firebase
export const auth: Auth = getAuth(app);

export const db = getDatabase(app);

export { app };