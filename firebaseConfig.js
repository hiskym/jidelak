import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore'
import {collection} from 'firebase/firestore'

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
// console.log(db);
// console.log(collection(db, "recipes"))

export const recipesRef = collection(db, "recipes")
// console.log(colRef)
// const colRef = collection(db, "/recipes")
// console.log(colRef);

// async function myAsyncFunction() {
//     const querySnapshot = await getDocs(collection(db, "recipes"));
//     querySnapshot.forEach((doc) => {
//       console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
//     });
// }

// myAsyncFunction();


// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
