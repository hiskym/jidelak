import { doc, getDoc, getDocs, query, where, limit, startAfter} from "firebase/firestore";
import { recipesRef, recipeIngredientsRef, ingredientsRef } from "../firebaseConfig";
import { getRecipeData, storeRecipeData, getRecipeIngredients, storeRecipeIngredients, isExpired } from "./cacheUtils";

export const fetchRecipeData = async (recipeId, setRecipeData, setCheckedSteps) => {
    try {

        const cachedData = await getRecipeData(recipeId)

        if (cachedData && !isExpired(cachedData.timestamp)) {
            setRecipeData(cachedData);
            setCheckedSteps(new Array(cachedData.steps.length).fill(false));
            return;
        }

        const recipeDoc = doc(recipesRef, recipeId);
        const recipeSnapshot = await getDoc(recipeDoc);

        if (recipeSnapshot.exists()) {
            const recipeData = recipeSnapshot.data();
            const timestamp = Date.now();
            const recipeDataWithTimestamp = {...recipeData, timestamp}
            await storeRecipeData(recipeId, recipeDataWithTimestamp);
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
        const cachedData = await getRecipeIngredients(recipeId)

        if (cachedData && !isExpired(cachedData[cachedData.length -1].timestamp)) {
            setRecipeIngredients(cachedData)
            return;
        }

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
        const timestamp = Date.now();
        const ingredientsDataWithTimestamp = [...ingredientsData, {'timestamp': timestamp}]

        await storeRecipeIngredients(recipeId, ingredientsDataWithTimestamp)
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

export const getAllRecipes = async (setLoading, setErr, lastDocument, setLastDocument, setRecipes) => {
    setLoading(true);
    setErr("");

    try {
        let recipeQuery = recipesRef;

        if (lastDocument) {
            recipeQuery = query(recipeQuery, startAfter(lastDocument), limit(8))
        } else {
            recipeQuery = query(recipeQuery, limit(8));
        }

        const querySnapshot = await getDocs(recipeQuery);

        const recipesData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            data: {
                image: doc.data().image,
                name: doc.data().name,
            }
        }));

        if (querySnapshot.docs.length > 0) {
            setLastDocument(querySnapshot.docs[querySnapshot.docs.length - 1]);
            setRecipes(prevRecipes => [...prevRecipes, ...recipesData]);
        } else {
            setLastDocument(null);
        }
    } catch (error) {
        console.log("Error:", error);
        setErr(error);
        setRecipes([]);
    }
    setLoading(false)
}

export const getRecipesByName = async (setLoading, setErr, searchQuery, setLastDocument, setRecipes) => {
    setLoading(true);
    setErr('');
    try {
        let recipeQuery;

        if (searchQuery !== '') {
            recipeQuery = query(recipesRef, where('name', '>=', searchQuery), where('name', '<=', searchQuery + '\uf8ff'), limit(10))
        }

        const querySnapshot = await getDocs(recipeQuery);

        const recipesData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            data: {
                image: doc.data().image,
                name: doc.data().name,
            }
        }));

        if (querySnapshot.docs.length > 0) {
            setLastDocument(null);
            setRecipes([...recipesData]);
        } else {
            setLastDocument(null);
        }

    } catch (error) {
        console.log("Error:", error);
        setErr(error);
        setRecipes([]);
    }
    setLoading(false)
}

export const getAllRecipesByCookTime = async (setLoading, setErr, lastDocument, setLastDocument, setRecipes, timeQuery) => {
    setLoading(true);
    setErr('');
    try {
        let recipeQuery;

        recipeQuery = query(recipesRef, where('cook_time', '<=', parseInt(timeQuery)), limit(10))

        const querySnapshot = await getDocs(recipeQuery);

        const recipesData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            data: {
                image: doc.data().image,
                name: doc.data().name,
            }
        }));

        if (querySnapshot.docs.length > 0) {
            setLastDocument(null);
            console.log(recipesData)
            setRecipes([...recipesData]);
        } else {
            setLastDocument(null);
        }

    } catch (error) {
        console.log("Error:", error);
        setErr(error);
        setRecipes([]);
    }
    setLoading(false)
}

export const getAllRecipesByCalories = async (setLoading, setErr, lastDocument, setLastDocument, setRecipes, calories) => {
    setLoading(true);
    setErr('');
    try {
        let recipeQuery;

        recipeQuery = query(recipesRef, where('nutrition.calories', '<=', parseInt(calories)), limit(10))

        const querySnapshot = await getDocs(recipeQuery);

        const recipesData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            data: {
                image: doc.data().image,
                name: doc.data().name,
            }
        }));

        if (querySnapshot.docs.length > 0) {
            setLastDocument(null);
            console.log(recipesData)
            setRecipes([...recipesData]);
        } else {
            setLastDocument(null);
        }

    } catch (error) {
        console.log("Error:", error);
        setErr(error);
        setRecipes([]);
    }
    setLoading(false)
}

export const getAllRecipesByIngredient = async (setLoading, setErr, setRecipes, ingredient) => {
    setLoading(true);
    setErr('')

    try {

        const ingredientQuery = query(ingredientsRef, where('title', '>=', ingredient), where('title', '<=', ingredient + '\uf8ff'), limit(10))

        const ingredientsSnapshot = await getDocs(ingredientQuery);

        if (ingredientsSnapshot.empty) {
            console.error('not found');
            setErr('eror')
            setLoading(false);
            setRecipes([]);
            return;
        }

        const ingredientId = ingredientsSnapshot.docs[0].id;

        const recipeIngredientsQuery = query(recipeIngredientsRef, where('ingredientId', '==', ingredientId))

        const recipeIngredientsSnapshot = await getDocs(recipeIngredientsQuery);

        const recipesData = [];

        for (const recipeIngredientsDoc of recipeIngredientsSnapshot.docs) {
            const { recipeId } = recipeIngredientsDoc.data();

            const recipeDoc = await getDoc(doc(recipesRef, recipeId));

            if (recipeDoc.exists()) {
                const { name, image } = recipeDoc.data()

                const recipeData = {
                    id: recipeId,
                    data: {
                        image: image,
                        name: name,
                    }
                }

                recipesData.push(recipeData)
            } else {
                console.error('not found')
            }
        }
        setRecipes(recipesData)

    } catch (error) {
        console.error(error)
        setErr(error)
        setRecipes([])
    }
    setLoading(false)
}

export const getAllRecipesByCategory = async (setLoading, setErr, lastDocument, setLastDocument, setRecipes, category) => {
    setLoading(true);
    setErr('');
    try {
        let recipeQuery;

        recipeQuery = query(recipesRef, where('category', 'array-contains-any', [category]), limit(10))

        const querySnapshot = await getDocs(recipeQuery);

        console.log(querySnapshot.docs)

        const recipesData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            data: {
                image: doc.data().image,
                name: doc.data().name,
            }
        }));

        console.log(recipesData)

        if (querySnapshot.docs.length > 0) {
            setLastDocument(null);
            console.log(recipesData)
            setRecipes([...recipesData]);
        } else {
            setLastDocument(null);
        }

    } catch (error) {
        console.log("Error:", error);
        setErr(error);
        setRecipes([]);
    }
    setLoading(false)
}