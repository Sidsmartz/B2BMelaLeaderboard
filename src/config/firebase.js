import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAO4mvdAJwxvcxvQp3WV6kuppuboNYcVVE",
  authDomain: "b2bstall.firebaseapp.com",
  databaseURL: "https://b2bstall-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "b2bstall",
  storageBucket: "b2bstall.firebasestorage.app",
  messagingSenderId: "71474750145",
  appId: "1:71474750145:web:7fce99dec054440accea40",
  measurementId: "G-FTZM3V3YXV"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

export { auth, database };