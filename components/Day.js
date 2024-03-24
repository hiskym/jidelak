import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import FoodCard from './FoodCard';
import { formatDate } from '../utils/DateUtils';
import { sumUpNutrition } from '../utils/menuUtils';

export default function Day({ meals, navigation, day, userMacros }) {

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
    <View className="flex flex-row flex-wrap p-2 justify-center">
      <View className="flex flex-row flex-wrap [w-90%] items-center justify-center">
        <View className="flex flex-row">
          <Text className="my-2 text-xs text-slate-900">Kalorie: </Text>
          <Text className={`my-2 text-xs text-slate-900 ${calories < userMacros.calories - 300 || calories > userMacros.calories + 300 ? 'text-red-500' : 'text-teal-600'}`}>{calories} </Text>

        </View>
        <View className="flex flex-row">
          <Text className="my-2 text-xs text-slate-900">Sacharidy: </Text>
          <Text className={`my-2 text-xs text-slate-900 ${carbs < 0.9 * userMacros.carbs || carbs > 1.1 * userMacros.carbs ? 'text-red-500' : 'text-teal-600'}`}>{carbs}g </Text>
        </View>
        <View className="flex flex-row">
          <Text className="my-2 text-xs text-slate-900">Bílkoviny: </Text>
          <Text className={`my-2 text-xs text-slate-900 ${proteins < 0.9 * userMacros.proteins || proteins > 1.1 * userMacros.proteins ? 'text-red-500' : 'text-teal-600'}`}>{proteins}g </Text>
        </View>
        <View className="flex flex-row">
          <Text className="my-2 text-xs text-slate-900">Tuky: </Text>
          <Text className={`my-2 text-xs text-slate-900 ${fats < 0.9 * userMacros.fats || fats > 1.1 * userMacros.fats ? 'text-red-500' : 'text-teal-600'}`}>{fats}g </Text>
        </View>
        <View className="flex flex-row">
          <Text className="my-2 text-xs text-slate-900">Vláknina: </Text>
          <Text className={`my-2 text-xs text-slate-900 ${fiber < 0.9 * userMacros.fiber ? 'text-red-500' : 'text-teal-600'}`}>{fiber}g</Text>
        </View>
      </View>
      <View className="flex flex-wrap flex-row justify-center">
        {dayMeals.map((meal, mealIndex) => (
          <View key={mealIndex} className="flex flex-row">
            <TouchableOpacity onPress={() => navigation.navigate('MealDetail', meal)}>
              <FoodCard
                image={meal.recipe.image}
                size={80}
                width='20'
                height='20'
              />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  )
}