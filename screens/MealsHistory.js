import { View, Text, ScrollView, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getLastTenDays, getSelectedDayDate, formatDate, endOfDay, startOfDay } from '../utils/DateUtils';
import IconButton from '../components/IconButton';
import { query, where, onSnapshot, doc, getDoc, Timestamp } from 'firebase/firestore';
import { recipesRef, mealsRef } from '../firebaseConfig';
import { useUserStore } from '../store/UserStore';
import HistoricDay from '../components/HistoricDay'
import MealDayFilter from '../components/MealDayFilter';
import { getRecipeData } from '../utils/cacheUtils';

export default function MealsHistory({ navigation }) {

  const currentDate = new Date();

  const dateMinusTen = new Date(currentDate);
  dateMinusTen.setDate(currentDate.getDate() - 9);

  const lastTenDays = getLastTenDays(currentDate);

  const [meals, setMeals] = useState([]);

  const { user } = useUserStore();

  const [loading, setLoading] = useState(false);

  const [selectedDay, setSelectedDay] = useState('');

  const selectedDayStart = Timestamp.fromDate(startOfDay(selectedDay));
  const selectedDayEnd = Timestamp.fromDate(endOfDay(selectedDay));

  const [selectedDayDate, setSelectedDayDate] = useState('');

  useEffect(() => {
    setLoading(true);

    let mealsQuery;

    if (selectedDay) {
      mealsQuery = query(mealsRef, where('userId', '==', user.uid), where('day', '<=', selectedDayEnd), where('day', '>=', selectedDayStart));
      setSelectedDayDate(getSelectedDayDate(selectedDay));
    } else {
      mealsQuery = query(mealsRef, where('userId', '==', user.uid), where('day', '<=', currentDate), where('day', '>=', dateMinusTen));
    }
    const unsubscribe = onSnapshot(mealsQuery, async (querySnapshot) => {

      try {

        const mealsData = [];

        for (const docSnapshot of querySnapshot.docs) {

          const { day, recipeId } = docSnapshot.data();

          const cachedRecipe = await getRecipeData(recipeId);

          if (cachedRecipe) {
            const { image, nutrition } = cachedRecipe;
            mealsData.push({ day, recipeId, recipe: { image, nutrition } });
          } else {
            const recipeDocRef = doc(recipesRef, recipeId);
            const recipeDocSnapshot = await getDoc(recipeDocRef);

            if (recipeDocSnapshot.exists()) {
              const { image, nutrition } = recipeDocSnapshot.data();
              mealsData.push({ day, recipeId, recipe: { image, nutrition } });
            }
          }
        }

        if (mealsData.length === 0) {
          console.log('No records for this day');
          setMeals([]);
          setLoading(false);
          return;
        }

        setMeals(mealsData)
        setLoading(false)

      } catch (error) {
        console.error('Error fetching meals and recipes:', error);
        setLoading(false);
      }
    })
    return () => unsubscribe;


  }, [user.uid, selectedDay])

  const [showDetails, setShowDetails] = useState(false);



  return (
    <ScrollView className="flex flex-col bg-white">
      <View className="bg-teal-50 shadow-sm w-full rounded-b-2xl pb-5 h-max mb-2">
        {loading && <ActivityIndicator size="small" color="tomato" className="flex-1 justify-center rounded-sm scale-150 p-2" />}
        {!loading && (
          <View className="flex-row justify-center py-5 shadow-sm">
            <IconButton icon={"analytics-outline"} onPress={() => navigation.navigate('Analytics')} />
            <IconButton icon={"filter"} onPress={() => setShowDetails(true)} />
          </View>
        )}

        {showDetails && (
          <View className="items-center">
            <MealDayFilter setShowDetails={setShowDetails} selectedDay={selectedDay} setSelectedDay={setSelectedDay} />
          </View>
        )}
        <View className="">
          {meals && meals.length >= 2 ? (
            <Text className="text-lg text-center m-2 text-slate-900">Zde vidíte posledních 10 dní vašeho stravování. Pokud vás zajímá jiný den, můžete filtrovat.</Text>
          ) : null}
        </View>
      </View>

      <View className="text-center">
        {!selectedDay ? (lastTenDays.map((day, index) => (
          <View key={index} className={`w-full min-h-[96px] items-center ${index % 2 === 0 ? 'bg-white' : 'bg-gray-100 rounded-2xl my-1 shadow-sm'} py-2`}>
            <Text className="font-bold text-lg text-slate-900">{day.day}</Text>
            <Text className="text-slate-900">{day.date}. {day.month}. {day.year}</Text>
            <View className="border-b-black border-[0.5px] w-[90%]" />

            {meals && meals.some(meal => formatDate(meal.day) === `${day.month}/${day.date}/${day.year}`) ? (
              <HistoricDay meals={meals} day={day} />
            ) : null}
          </View>
        ))) : (
          selectedDayDate && selectedDayDate.map((day, index) => (
            <View key={index} className={`w-full min-h-[96px] items-center ${index % 2 === 0 ? 'bg-white' : 'bg-gray-100 rounded-2xl my-1 shadow-sm'} py-2`}>
              <Text className="font-bold text-lg text-slate-900">{day.day}</Text>
              <Text className="text-slate-900">{day.date}. {day.month}. {day.year}</Text>
              <View className="border-b-black border-[0.5px] w-[90%]" />

              {meals && meals.some(meal => formatDate(meal.day) === `${day.month}/${day.date}/${day.year}`) ? (
                <HistoricDay meals={meals} day={day} />
              ) : <Text className="text-base mt-2 text-slate-900">Pro tento den nebyly zaznamenány žádné pokrmy.</Text>}
            </View>)))}
      </View>
    </ScrollView>
  )
}