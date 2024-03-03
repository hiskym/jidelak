import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import FoodCard from './FoodCard'

export default function Day({ meals, navigation, day, formatDate, userMacros }) {

  const [calories, setCalories] = useState(0);

  const [fats, setFats] = useState(0);

  const [carbs, setCarbs] = useState(0);

  const [fiber, setFiber] = useState(0);

  const [proteins, setProteins] = useState(0);

  const dayMeals = meals.filter((meal) => formatDate(meal.day) === `${day.month}/${day.date}/${day.year}`);

  const sumUpNutrition = () => {
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

  useEffect(() => {
    sumUpNutrition()
  }, [meals])

  return (
    <View className="flex flex-row flex-wrap p-2 justify-center">
      <View className="flex flex-row justify-evenly w-full">
        
        <Text className="my-2 text-xs">Kalorie: </Text>
        <Text className={`my-2 text-xs ${calories < userMacros.calories  ? 'text-green-500' : 'text-red-500'}`}>{calories} </Text>
        <Text className="my-2 text-xs">Sacharidy: </Text>
        <Text className={`my-2 text-xs ${carbs < userMacros.carbs  ? 'text-green-500' : 'text-red-500'}`}>{carbs}g </Text>
        <Text className="my-2 text-xs">Bílkoviny: </Text>
        <Text className={`my-2 text-xs ${proteins < userMacros.proteins  ? 'text-green-500' : 'text-red-500'}`}>{proteins}g </Text>
        <Text className="my-2 text-xs">Tuky: </Text>
        <Text className={`my-2 text-xs ${fats < userMacros.fats  ? 'text-green-500' : 'text-red-500'}`}>{fats}g </Text>
        <Text className="my-2 text-xs">Vláknina: </Text>
        <Text className={`my-2 text-xs ${fiber > userMacros.fiber  ? 'text-green-500' : 'text-red-500'}`}>{fiber}g</Text>
      </View>
      
      {dayMeals.map((meal, mealIndex) => (
          <View key={mealIndex} className="flex flex-row">
            <TouchableOpacity onPress={() => {}}>
              <FoodCard
                image={meal.recipe.image}
              />
            </TouchableOpacity>
          </View>
        ))}

    </View>
  )
}