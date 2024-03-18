import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeRecipeData = async (recipeId, recipeData) => {
    try {
        await AsyncStorage.setItem(`recipes:${recipeId}`, JSON.stringify(recipeData));
    } catch (error) {
        console.error(error);
    }
};

export const getRecipeData = async (recipeId) => {
    try {
        const cachedRecipeData = await AsyncStorage.getItem(`recipes:${recipeId}`);
        return cachedRecipeData ? JSON.parse(cachedRecipeData) : null;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const storeRecipeIngredients = async (recipeId, ingredientsData) => {
    try {
        await AsyncStorage.setItem(`recipeIngredients:${recipeId}`, JSON.stringify(ingredientsData));
    } catch (error) {
        console.error(error);
    }
};

export const getRecipeIngredients = async (recipeId) => {
    try {
        const cachedRecipeIngredientsData = await AsyncStorage.getItem(`recipeIngredients:${recipeId}`);
        return cachedRecipeIngredientsData ? JSON.parse(cachedRecipeIngredientsData) : null;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const clearCache = async () => {
    try {
        AsyncStorage.clear();
    } catch (error) {
        console.error(error);
    }
}

export const isExpired = (timestamp) => {
    const expirationTime = timestamp + 1209600000;
    const currentTime = Date.now();
    return currentTime > expirationTime;
};