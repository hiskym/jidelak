import { View, Text, Image } from 'react-native'
import React from 'react'

export default function FoodCard({image}) {
  return (
    <View className="border border-slate-300 rounded-lg bg-slate-200 flex flex-col p-2 my-2 w-20 h-20 max-h-80 items-center justify-center m-2">
      <Image 
        style={{width: 80, height: 80, resizeMode: 'center', borderRadius: 20}} 
        source={{uri: image}}
      />
    </View>
  )
}