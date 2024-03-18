import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import FoodCard from './FoodCard'
import { formatDate } from '../utils/DateUtils';
import { sumUpNutrition } from '../utils/menuUtils';

export default function Day({ meals, day }) {

  const [calories, setCalories] = useState(0);

  const [fats, setFats] = useState(0);

  const [carbs, setCarbs] = useState(0);

  const [fiber, setFiber] = useState(0);

  const [proteins, setProteins] = useState(0);

  const dayMeals = meals.filter((meal) => formatDate(meal.day) === `${day.month}/${day.date}/${day.year}`);

  useEffect(() => {
    sumUpNutrition(dayMeals, setCalories, setFats, setCarbs, setFiber, setProteins)
  }, [meals])

  return (
    <View className="flex flex-col p-2">
      <View className="flex flex-row flex-wrap [w-80%] items-center justify-center">
        
        <Text className="my-2 text-xs mr-2 text-slate-900">Kalorie: {calories} </Text>
        <Text className="my-2 text-xs mr-2 text-slate-900">Sacharidy: {carbs}g </Text>
        <Text className="my-2 text-xs mr-2 text-slate-900">Bílkoviny: {proteins}g </Text>
        <Text className="my-2 text-xs mr-2 text-slate-900">Tuky: {fats}g </Text>
        <Text className="my-2 text-xs mr-2 text-slate-900">Vláknina: {fiber}g</Text>
      </View>
      <View className="flex flex-wrap flex-row justify-center">
        {dayMeals.map((meal, mealIndex) => (
            <View key={mealIndex} className="flex flex-row">
              <FoodCard
                  image={meal.recipe.image}
                  size={60}
                  width='16'
                  height='16'
                />
            </View>
          ))}
      </View>
      

    </View>
  )
}