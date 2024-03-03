import { View, Text, FlatList } from 'react-native'
import React from 'react'

export default function Settings({ navigation }) {

  // currently testing screen

  const nutrition = { "calories": 275, "proteins": 20 };

  const translateNutrition = {
    "calories": "Kalorie",
    "proteins": "Bílkoviny",
  }

  return (
    <View className="flex flex-1 gap-2 border rounded-lg">
      <Text className="font-bold text-lg">Výživové hodnoty:</Text>
      <FlatList
        data={Object.entries(nutrition)}
        renderItem={({ item }) => (
          <View className="flex flex-row items-center w-96 m-1 left-2">
            <Text>{translateNutrition[item[0]]}: {item[0] === "calories" ? ` ${item[1]} kcal` : ` ${item[1]} g`}</Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        scrollEnabled={false}
      />
    </View>
  )
}