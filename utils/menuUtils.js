import { mealsRef } from "../firebaseConfig";
import { addDoc } from "firebase/firestore";

export const addToMenu = async (recipeId, userId, day, type, note) => {

    try {
        const menuObj = { recipeId, userId, day, type, note };

        await addDoc(mealsRef, menuObj);

    } catch (error) {
        console.log(error)
    }

}