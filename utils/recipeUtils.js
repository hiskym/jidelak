import { doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { recipesRef, recipeIngredientsRef, ingredientsRef } from "../firebaseConfig";

export const fetchRecipeData = async (recipeId, setRecipeData, setCheckedSteps) => {
    try {
        const recipeDoc = doc(recipesRef, recipeId);
        const recipeSnapshot = await getDoc(recipeDoc);

        if (recipeSnapshot.exists()) {
            const recipeData = recipeSnapshot.data();
            setRecipeData(recipeData);
            setCheckedSteps(new Array(recipeData.steps.length).fill(false));
        } else {
            console.log(`Error: ${recipeId} doesnt exist`);
        }
    } catch (error) {
        console.error('Error fetching recipe data:', error);
    }
};

export const fetchRecipeIngredients = async (recipeId, setRecipeIngredients) => {
    try {
        const recipeIngredientsQuery = query(recipeIngredientsRef, where('recipeId', '==', recipeId));
        const recipeIngredientsSnapshot = await getDocs(recipeIngredientsQuery);

        const ingredientsData = [];

        for (const docRef of recipeIngredientsSnapshot.docs) {
            const { ingredientId, amount } = docRef.data();

            const ingredientDoc = await getDoc(doc(ingredientsRef, ingredientId));

            if (ingredientDoc.exists()) {
                const { title, unit } = ingredientDoc.data();

                const ingredientData = { title, unit, amount };

                ingredientsData.push(ingredientData);

            } else {
                console.error(`${ingredientId} not found.`);
            }

        }
        setRecipeIngredients(ingredientsData);

        // console.log(ingredientsData);
    } catch (error) {
        console.error(error);
    }

}

export const translateNutrition = {
    "calories": "Kalorie",
    "proteins": "Bílkoviny",
    "carbs": "Sacharidy",
    "fats": "Tuky",
    "fiber": "Vláknina"
}