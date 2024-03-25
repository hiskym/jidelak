import { doc, getDoc, getDocs, query, where, limit, startAfter } from "firebase/firestore";
import { recipesRef, recipeIngredientsRef, ingredientsRef } from "../firebaseConfig";
import { getRecipeData, storeRecipeData, getRecipeIngredients, storeRecipeIngredients, isExpired } from "./cacheUtils";

export const fetchRecipeData = async (recipeId, setRecipeData, setCheckedSteps) => {
    try {

        const cachedData = await getRecipeData(recipeId)

        if (cachedData && !isExpired(cachedData.timestamp)) {
            setRecipeData(cachedData);
            setCheckedSteps(new Array(cachedData.steps.length).fill(false));
            return;
        }

        const recipeDoc = doc(recipesRef, recipeId);
        const recipeSnapshot = await getDoc(recipeDoc);

        if (recipeSnapshot.exists()) {
            const recipeData = recipeSnapshot.data();
            const timestamp = Date.now();
            const recipeDataWithTimestamp = { ...recipeData, timestamp }
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

        if (cachedData && !isExpired(cachedData.timestamp)) {
            setRecipeIngredients(cachedData)
            // console.log(cachedData)
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

                const timestamp = Date.now();

                const ingredientData = { title, unit, amount, timestamp };

                ingredientsData.push(ingredientData);

            } else {
                console.error(`${ingredientId} not found.`);
            }

        }

        await storeRecipeIngredients(recipeId, ingredientsData)
        setRecipeIngredients(ingredientsData);

        // console.log(ingredientsData);
    } catch (error) {
        console.error(error);
    }

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

export const getFewRecipes = async (setLoading, setErr, lastDocument, setLastDocument, setInitialRecipes) => {
    setLoading(true);
    setErr("");

    try {
        let recipeQuery = recipesRef;

        recipeQuery = query(recipeQuery, limit(6));

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
            setInitialRecipes([...recipesData]);
        } else {
            setLastDocument(null);
        }
    } catch (error) {
        console.log("Error:", error);
        setErr(error);
        setInitialRecipes([]);
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
            // console.log(recipesData)
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
            // console.log(recipesData)
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

export const getAllRecipesByIngredient = async (setLoading, setErr, setRecipes, ingredients) => {
    setLoading(true);
    setErr('');

    try {
        let recipesData = [];

        if (ingredients.length === 1) {
            const ingredientQuery = query(ingredientsRef, where('title', '>=', ingredients[0]), where('title', '<=', ingredients[0] + '\uf8ff'), limit(10))

            const ingredientsSnapshot = await getDocs(ingredientQuery);

            if (ingredientsSnapshot.empty) {
                console.error('not found');
                setErr('eror');
                setLoading(false);
                setRecipes([]);
                return;
            }

            const ingredientId = ingredientsSnapshot.docs[0].id;

            const recipeIngredientsQuery = query(recipeIngredientsRef, where('ingredientId', '==', ingredientId));
            const recipeIngredientsSnapshot = await getDocs(recipeIngredientsQuery);

            for (const recipeIngredientsDoc of recipeIngredientsSnapshot.docs) {
                const { recipeId } = recipeIngredientsDoc.data();

                const cachedRecipe = await getRecipeData(recipeId);

                if (cachedRecipe) {
                    const { image, name } = cachedRecipe;
                    recipesData.push({
                        id: recipeId,
                        data: {
                            image: image,
                            name: name,
                        }
                    });
                } else {
                    const recipeDoc = await getDoc(doc(recipesRef, recipeId));

                    if (recipeDoc.exists()) {
                        const { name, image } = recipeDoc.data();
                        recipesData.push({
                            id: recipeId,
                            data: {
                                image: image,
                                name: name,
                            }
                        });
                    } else {
                        console.error('not found');
                    }
                }
            }
        } else {
            const recipeIds = new Set();

            for (const ingredient of ingredients) {
                const ingredientQuery = query(ingredientsRef, where('title', '>=', ingredient), where('title', '<=', ingredient + '\uf8ff'), limit(10))

                const ingredientsSnapshot = await getDocs(ingredientQuery);

                if (ingredientsSnapshot.empty) {
                    console.error('not found');
                    setErr('error');
                    setLoading(false);
                    setRecipes([]);
                    return;
                }

                const ingredientId = ingredientsSnapshot.docs[0].id;

                const recipeIngredientsQuery = query(recipeIngredientsRef, where('ingredientId', '==', ingredientId));
                const recipeIngredientsSnapshot = await getDocs(recipeIngredientsQuery);

                const recipeIdsForIngredient = new Set();

                for (const recipeIngredientsDoc of recipeIngredientsSnapshot.docs) {
                    const { recipeId } = recipeIngredientsDoc.data();
                    recipeIdsForIngredient.add(recipeId);
                }

                if (recipeIds.size === 0) {
                    recipeIdsForIngredient.forEach(id => recipeIds.add(id));
                } else {
                    recipeIds.forEach(id => {
                        if (!recipeIdsForIngredient.has(id)) {
                            recipeIds.delete(id);
                        }
                    });
                }
            }

            for (const recipeId of recipeIds) {

                const cachedRecipe = await getRecipeData(recipeId);

                if (cachedRecipe) {
                    const { image, name } = cachedRecipe;
                    recipesData.push({
                        id: recipeId,
                        data: {
                            image: image,
                            name: name,
                        }
                    });
                } else {
                    const recipeDoc = await getDoc(doc(recipesRef, recipeId));

                    if (recipeDoc.exists()) {
                        const { name, image } = recipeDoc.data();
                        recipesData.push({
                            id: recipeId,
                            data: {
                                image: image,
                                name: name,
                            }
                        });
                    } else {
                        console.error('not found');
                    }
                }
            }
        }

        if (recipesData.length === 0) {
            setErr('err')
        }

        setRecipes(recipesData);
    } catch (error) {
        console.error('Error:', error);
        setErr(error.message);
        setRecipes([]);
    }

    setLoading(false);
};


export const getAllRecipesByCategory = async (setLoading, setErr, lastDocument, setLastDocument, setRecipes, category) => {
    setLoading(true);
    setErr('');
    try {
        let recipeQuery;

        recipeQuery = query(recipesRef, where('category', 'array-contains-any', [category]), limit(10))

        const querySnapshot = await getDocs(recipeQuery);

        // console.log(querySnapshot.docs)

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
            // console.log(recipesData)
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

export const translateNutrition = {
    "calories": "Kalorie",
    "proteins": "Bílkoviny",
    "carbs": "Sacharidy",
    "fats": "Tuky",
    "fiber": "Vláknina"
}

export const translateAlergens = {
    "no alergens": "žádné",
    "gluten": "lepek",
    "dairy": "mléko",
    "egg": "vejce",
    "fish": "ryba",
    "krill": "korýši",
    "peanuts": "arašídy",
    "soybeans": "sója",
    "nuts": "skořápkové plody",
    "celery": "celer",
    "mustard": "hořčice",
    "sesame": "sezamová semena",
    "SO2": "oxid siřičitý",
    "lupine": "vlčí bob",
    "shellfish": "měkkýši"
}

export const translateCategory = {
    "breakfast": "anídaně",
    "lunch": "oběd",
    "dinner": "večeře",
    "snac": "svačinka",
}