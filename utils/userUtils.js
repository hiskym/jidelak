import { doc, getDoc, getDocs, query, where, deleteDoc } from "firebase/firestore";
import { usersRef, mealsRef } from "../firebaseConfig";
import { deleteUser } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const fetchMacros = async (userId, setUserMacros) => {
  const userDoc = doc(usersRef, userId);

  try {
    const userSnapshot = await getDoc(userDoc)

    if (userSnapshot.exists()) {
      const userMacrosData = userSnapshot.data().macros;
      setUserMacros(userMacrosData)
    }
  } catch (error) {
    console.log(error)
  }
}

export const getUsername = async (userId, setUsername) => {
  try {
    const userDoc = doc(usersRef, userId);
    const userDocSnapshot = await getDoc(userDoc);
    if (userDocSnapshot.exists()) {
      const username = userDocSnapshot.data().name;

      const newUsername = username || '';

      setUsername(newUsername);
    }
  } catch (error) {
    console.log(error)
  }
}

export const deleteAccount = async (user, userId) => {
  try {
    const userDoc = doc(usersRef, userId);

    const mealsQuery = query(mealsRef, where('userId', '==', userId));
    
    const mealsSnapshot = await getDocs(mealsQuery);

    if (!mealsSnapshot.empty){
      mealsSnapshot.forEach(async (mealDoc) => await deleteDoc(mealDoc.ref))
    } else {
      console.log('empty')
    }
  
    await deleteDoc(userDoc)
    
    await deleteUser(user)

    await AsyncStorage.removeItem('user');

  } catch (error) {
    console.log(error)
  }
}