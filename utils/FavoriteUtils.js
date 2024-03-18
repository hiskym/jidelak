import { favoritesRef } from "../firebaseConfig";
import { getDocs, query, where, deleteDoc, doc, addDoc } from "firebase/firestore";
import { Alert } from "react-native";

export const removeFromFavorites = async (recipeId, userId) => {
    try {
        const favoriteSnapshot = await getDocs(query(favoritesRef, where("userId", "==", userId), where("recipeId", "==", recipeId)));

        if (!favoriteSnapshot.empty) {
            const favoriteId = favoriteSnapshot.docs[0].id;

            await deleteDoc(doc(favoritesRef, favoriteId));
        }

    } catch (error) {
        console.error(error);
    }
};

export const addToFavorites = async (recipeId, userId) => {
    try {
        const favoriteSnapshot = await getDocs(query(favoritesRef, where("userId", "==", userId), where("recipeId", "==", recipeId)));

        if (!favoriteSnapshot.empty) {
            Alert.alert(
                'Nelze přidat',
                'Recept je již označen jako oblíbený', [
                {
                    text: 'OK',
                    onPress: () => console.log('Recipe already exists in favorites.')
                }
            ])
        } else {
            const favoriteObj = { recipeId, userId };

            await addDoc(favoritesRef, favoriteObj);
            Alert.alert('Úspěch!', 'Úspešně přidáno', [
                { text: 'OK' }
            ])
        }

    } catch (error) {
        console.error(error);
    }
}