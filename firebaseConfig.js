import { initializeApp } from 'firebase/app';
import {getFirestore} from 'firebase/firestore'

// Initialize Firebase

const firebaseConfig = {
    apiKey: "AIzaSyATW6Dj0cjDQQrwvJrCgZfR05QbVRpVqxk",
    authDomain: "jidelak-4f111.firebaseapp.com",
    projectId: "jidelak-4f111",
    storageBucket: "jidelak-4f111.appspot.com",
    messagingSenderId: "821169222736",
    appId: "1:821169222736:web:de0d5569bc72b2eb424d55"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
