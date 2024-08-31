import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC-kNMK09BV0KhK-K2Wah7TaEoAns4i68Q",
  authDomain: "rentmyparking-2a775.firebaseapp.com",
  projectId: "rentmyparking-2a775",
  storageBucket: "rentmyparking-2a775.appspot.com",
  messagingSenderId: "269798619191",
  appId: "1:269798619191:web:46441f6ed792d6fcd927b2",
  measurementId: "G-247PCP2472"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
