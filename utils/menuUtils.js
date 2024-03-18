import { mealsRef, recipesRef } from "../firebaseConfig";
import { addDoc, deleteDoc, doc, getDocs, query, where, getDoc} from "firebase/firestore";
import { getRecipeData } from "./cacheUtils";

export const addToMenu = async (recipeId, userId, day, type, note) => {

    try {
        const menuObj = { recipeId, userId, day, type, note };

        await addDoc(mealsRef, menuObj);

    } catch (error) {
        console.log(error)
    }

}

export const sumUpNutrition = (dayMeals, setCalories, setFats, setCarbs, setFiber, setProteins) => {
    let totalCalories = 0;
    let totalFats = 0;
    let totalCarbs = 0;
    let totalFiber = 0;
    let totalProteins = 0;

    dayMeals.forEach((meal) => {
      totalCalories += meal.recipe.nutrition.calories;
      totalFats += meal.recipe.nutrition.fats;
      totalCarbs += meal.recipe.nutrition.carbs;
      totalFiber += meal.recipe.nutrition.fiber;
      totalProteins += meal.recipe.nutrition.proteins;
    });

    setCalories(totalCalories);
    setFats(totalFats);
    setCarbs(totalCarbs);
    setFiber(totalFiber);
    setProteins(totalProteins);
  }

  export const removeFromMenu = async (mealId) => {
    try {
        await deleteDoc(doc(mealsRef, mealId));
    } catch (error) {
        console.error(error)
    }
  }

export const fetchDailyMacros = async (userId, currentDayEnd, weekStart, monthStart, endOfYear, startOfYear, setDailyMacros, interval, setLoading) =>  {

    let mealsQuery;

    if (interval === 'last-week') {
        mealsQuery = query(mealsRef, where('userId', '==', userId), where('day', '<=', currentDayEnd), where('day', '>=', weekStart));
    } else if (interval === 'last-month') {
        mealsQuery = query(mealsRef, where('userId', '==', userId), where('day', '<=', currentDayEnd), where('day', '>=', monthStart));
    } else if (interval === 'year') {
        mealsQuery = query(mealsRef, where('userId', '==', userId), where('day', '<=', endOfYear), where('day', '>=', startOfYear));
    } else if (interval === 'full'){
        mealsQuery = query(mealsRef, where('userId', '==', userId));
    } else {
        setDailyMacros([]);
        setLoading(false);
        return;
    }

    try {
        // 
        const mealsSnapshot = await getDocs(mealsQuery);
        
        const mealsByDate = {};
        mealsSnapshot.forEach(mealDoc => {
            const { recipeId, day } = mealDoc.data();
            const mealDate = day.toDate().toISOString().split('T')[0]; 
            if (!mealsByDate[mealDate]) {
                mealsByDate[mealDate] = [];
            }
            mealsByDate[mealDate].push({recipeId});
        });
        // console.log(mealsByDate)

        const dailyMacros = [];
        for (const date in mealsByDate) {
            const meals = mealsByDate[date];
            let totalCalories = 0;
            let totalProteins = 0;
            let totalCarbs = 0;
            let totalFiber = 0;
            let totalFats = 0;
            for (const meal of meals) {

                let recipeData;

                const cachedRecipe = await getRecipeData(meal.recipeId);

                if (cachedRecipe) {
                    recipeData = cachedRecipe.nutrition

                    totalCalories += recipeData.calories || 0;;
                    totalProteins += recipeData.proteins || 0;
                    totalCarbs += recipeData.carbs || 0;
                    totalFiber += recipeData.fats || 0;
                    totalFats += recipeData.fiber || 0;
                } else {
                    const recipeDoc = await getDoc(doc(recipesRef, meal.recipeId));

                    if (recipeDoc.exists()) {
                        recipeData = recipeDoc.data().nutrition;
    
                        totalCalories += recipeData.calories || 0;;
                        totalProteins += recipeData.proteins || 0;
                        totalCarbs += recipeData.carbs || 0;
                        totalFiber += recipeData.fats || 0;
                        totalFats += recipeData.fiber || 0;
                    }
                }   
            }
            dailyMacros.push({ date, totalCalories, totalProteins, totalFats, totalCarbs, totalFiber });
        }
        
        const dailyMacrosSorted = dailyMacros.sort((a, b) => new Date(a.date) - new Date(b.date));
        setDailyMacros(dailyMacrosSorted);
        return dailyMacros;
    } catch (error) {
        console.error(error);
        setDailyMacros([]);
        return [];
    }
}