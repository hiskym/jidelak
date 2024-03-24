import React from 'react'
import { Text, View, ScrollView, ActivityIndicator, Modal, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import Day from '../components/Day';
import { recipesRef } from '../firebaseConfig';
import { getDoc, doc, query, onSnapshot, where, Timestamp } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { mealsRef } from '../firebaseConfig';
import { useUserStore } from '../store/UserStore';
import { endOfDay, formatDate, getNextSevenDays, startOfDay } from '../utils/DateUtils';
import IconButton from '../components/IconButton';
import { fetchMacros } from '../utils/userUtils';
import MenuAddRecipe from './MenuAddRecipe';
import { addToCartFullWeek } from '../utils/CartUtils';
import { useCartStore } from '../store/CartStore';
import { getRecipeData } from '../utils/cacheUtils';

export default function Menu({ navigation }) {

  const { user } = useUserStore();

  const { addToCartRecipe } = useCartStore();

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const [userMacros, setUserMacros] = useState(null);

  const [meals, setMeals] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);

  const currentDate = new Date();

  const nextSevenDays = getNextSevenDays(currentDate);

  const dayStart = Timestamp.fromDate(startOfDay(currentDate));

  const datePlusSeven = new Date(currentDate);
  datePlusSeven.setDate(currentDate.getDate() + 6);

  const dayEnd = Timestamp.fromDate(endOfDay(datePlusSeven));

  useEffect(() => {
    setLoading(true);

    const mealsQuery = query(mealsRef, where('userId', '==', user.uid), where('day', '>=', dayStart), where('day', '<=', dayEnd));

    const unsubscribe = onSnapshot(mealsQuery, async (querySnapshot) => {
      try {

        const mealsData = [];

        for (const docSnapshot of querySnapshot.docs) {
          const { day, recipeId } = docSnapshot.data();
          const mealId = docSnapshot.id;

          const cachedRecipe = await getRecipeData(recipeId);

          if (cachedRecipe) {
            const { image, nutrition } = cachedRecipe;
            mealsData.push({ mealId, day, recipeId, recipe: { image, nutrition } });
          } else {
            const recipeDocRef = doc(recipesRef, recipeId);
            const recipeDocSnapshot = await getDoc(recipeDocRef);

            if (recipeDocSnapshot.exists()) {
              const { image, nutrition } = recipeDocSnapshot.data();
              mealsData.push({ mealId, day, recipeId, recipe: { image, nutrition } });
            }
          }
        }

        if (mealsData.length === 0) {
          console.log('No records for upcoming days');
          setMeals([]);
          setLoading(false);
          return;
        }

        setMeals(mealsData)
        setLoading(false)
      } catch (error) {
        console.error(error);
        setLoading(false);

      }
    })
    fetchMacros(user.uid, setUserMacros)
    return () => unsubscribe;

  }, [user.uid])

  const handleAddToCart = async () => {
    Alert.alert('Přidat do košíku', 'Chcete přidat jídelníček do košíku?', [
      {
        text: 'Zrušit'
      },
      {
        text: 'OK',
        onPress: () => addToCartFullWeek(addToCartRecipe, meals, setLoading)
      }
    ])
  }

  return (
    <ScrollView className="flex flex-col bg-white">

      <Modal visible={modalOpen} animationType="slide" className="bg-teal-50">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-col flex-1 justify-between pt-20 items-center bg-teal-50">
            <IconButton
              icon='close'
              onPress={() => setModalOpen(false)}
            />
            <MenuAddRecipe />
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <View className="bg-teal-50 shadow-sm w-full rounded-b-2xl pb-5 h-max mb-2">
        {loading && <ActivityIndicator size="small" color="tomato" className="flex-1 justify-center rounded-sm scale-150 p-2" />}
        <View className="flex-row justify-center py-5 w-full">
          <IconButton icon={"add"} onPress={() => setModalOpen(true)} />
          <IconButton icon={"calendar"} onPress={() => navigation.navigate('MealsHistory')} />
          <IconButton icon={"cart"} onPress={() => handleAddToCart()} />
          {userMacros ? (
            <IconButton icon={"analytics-outline"} onPress={() => navigation.navigate('Analytics')} />
          ) : (
            <IconButton icon={"body"} onPress={() => navigation.navigate('Survey')} />
          )}
        </View>
        {userMacros ? (
          <View className="p-2 justify-center items-center flex flex-row flex-wrap">
            <Text className="text-xl font-bold text-slate-900">Potřebné makroživiny pro každý den</Text>
            <Text className="text-lg m-3 font-medium text-slate-900">Kalorie: {userMacros.calories} kcal</Text>
            <Text className="text-lg m-3 font-medium text-slate-900">Sacharidy: {userMacros.carbs} g</Text>
            <Text className="text-lg m-3 font-medium text-slate-900">Bílkoviny: {userMacros.proteins} g</Text>
            <Text className="text-lg m-3 font-medium text-slate-900">Tuky: {userMacros.fats} g</Text>
            <Text className="text-lg m-3 font-medium text-slate-900">Vláknina: {userMacros.fiber} g</Text>
          </View>
        ) : (
          <View className="p-2 justify-center items-center">
            <Text className="text-xl font-bold text-slate-900 w-[90%] text-center">Vypadá to, že ještě nemáte nastavené údaje. Můžete to kdykoliv změnit výše v ikoně profilu.</Text>
          </View>
        )
        }
      </View>

      <View className="text-center">

        {nextSevenDays.map((day, index) => (
          <View key={index} className={`w-full min-h-[96px] items-center ${index % 2 === 0 ? 'bg-white' : 'bg-gray-100 rounded-2xl my-1 shadow-sm'} py-2`}>
            <Text className="font-bold text-lg text-slate-900">{day.day}</Text>
            <Text className="text-slate-900">{day.date}. {day.month}. {day.year}</Text>
            <View className="border-b-black border-[0.5px] w-[90%]" />

            {userMacros && meals.some(meal => formatDate(meal.day) === `${day.month}/${day.date}/${day.year}`) ? (
              <Day meals={meals} day={day} userMacros={userMacros} navigation={navigation} />
            ) : null}
          </View>
        ))}
      </View>
    </ScrollView>

  )
}
