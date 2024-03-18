import { doc, getDoc } from "firebase/firestore";
import { usersRef } from "../firebaseConfig";

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