import { View } from 'react-native'
import React from 'react'
import { Image } from 'expo-image'

export default function FoodCard({ image, size, height, width }) {
  return (
    <View className={`border border-slate-100 rounded-lg flex flex-col p-2 my-2 w-${width} h-${height} max-h-80 items-center justify-center m-2 bg-white shadow-sm`}>
      <Image
        style={{ width: size, height: size, borderRadius: 20 }}
        source={{ uri: image }}
        transition={1000}
      />
    </View>
  )
}