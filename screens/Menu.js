import React from 'react'
import { Text, View, ScrollView, ActivityIndicator, Button } from 'react-native';
import Day from '../components/Day';
import { recipesRef, usersRef } from '../firebaseConfig';
import { getDoc, doc, query, onSnapshot, where } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { mealsRef } from '../firebaseConfig';
import { useUserStore } from '../store/UserStore';
import { formatDate } from '../utils/DateUtils';


export default function Menu({ navigation }) {

  const {user} = useUserStore();

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const [userMacros, setUserMacros] = useState(null);

  // const userDoc = doc(usersRef, user.uid);

  const [meals, setMeals] = useState([]);

  const currentDate = new Date();

  const getNextSevenDays = () => {
    const days = ['Neděle', 'Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota'];
    const nextSevenDays = [];

    for (let i = 0; i <7; i++) {
      const date = new Date();
      date.setDate(currentDate.getDate() + i);
      nextSevenDays.push({ day: days[date.getDay()], date: date.getDate(), month: date.getMonth() + 1, year: date.getFullYear()});
    }

    return nextSevenDays;
  };

  const nextSevenDays = getNextSevenDays();

  useEffect(() => {
    setLoading(true);

    const mealsQuery = query(mealsRef, where('userId', '==', user.uid));

    const unsubscribe = onSnapshot(mealsQuery, async (querySnapshot) => {
    try {
      
        const mealsData = [];

        for (const docSnapshot of querySnapshot.docs) {

          const mealData = docSnapshot.data();
          const recipeId = mealData.recipeId;
          const recipeDocRef = doc(recipesRef, recipeId);
          const recipeDocSnapshot = await getDoc(recipeDocRef);

          if (recipeDocSnapshot.exists()) {
            const recipeData = recipeDocSnapshot.data();
            mealsData.push({ ...mealData, recipe: recipeData });
          }
        }
        // console.log('Meals data:', mealsData);
        setMeals(mealsData)
        setLoading(false)
      }catch (error) {
        console.error('Error fetching meals and recipes:', error);
        setLoading(false);
      
  }}) 
    fetchMacros()
    return () => unsubscribe;
    // console.log(meals)

    
  }, [user.uid])

  const fetchMacros = async () => {
    const userDoc = doc(usersRef, user.uid);

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

  return (
    <ScrollView className="flex flex-col">

      {/* if user logged in - then render inspiration menus */}
      {/* render dat pro tyden dopredu */}
      {loading && <ActivityIndicator size="small" color="tomato" className="flex-1 justify-center rounded-sm scale-150 p-2" />}
      {userMacros && (
        <View className="m-2 justify-center items-center">
        <Text className="text-xl font-bold">Potřebné makroživiny pro každý den</Text>
        <Text className="text-lg">🏃Kalorie: {userMacros.calories} g</Text>
        <Text className="text-lg">🍚Sacharidy: {userMacros.carbs} g</Text>
        <Text className="text-lg">🍗Bílkoviny: {userMacros.proteins} g</Text>
        <Text className="text-lg">🧈Tuky: {userMacros.fats} g</Text>
        <Text className="text-lg">🥬Vláknina: {userMacros.fiber} g</Text>
      </View>
      )}
      
      <View className="m-3 text-center">
        
        {nextSevenDays.map((day, index) => (
        <View key={index} className="w-full min-h-[96px] items-center">
          <Text className="font-bold text-lg">{day.day}</Text>
          <Text>{day.date}. {day.month}. {day.year}</Text>
          <View className="border-b-black border-[0.5px] w-full" />
        
        {userMacros && meals.some(meal => formatDate(meal.day) === `${day.month}/${day.date}/${day.year}`) ? (
          <Day meals={meals} formatDate={formatDate} day={day} userMacros={userMacros} />
        ) : null}
        </View>
        ))}
        {/* { console.log(meals)} */}
      </View>
    </ScrollView>

  )
}
