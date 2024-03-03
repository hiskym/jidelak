import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { formatDateCZ } from '../utils/DateUtils';

export default function CartItems({ carts, navigation }) {

  return (
    <View className="flex flex-col mx-10">
      <View className="flex flex-row justify-between">
        <Text className="text-xl">Název</Text>
        <Text className="text-xl">Nákup</Text>

      </View>
      <View className="border-[0.5px] mt-2 mb-4 border-slate-700" />
      {carts.map((cartItem) => (
        <View key={cartItem.id}>
          <TouchableOpacity  onPress={() => {navigation.navigate('CartDetail', cartItem) }}>
            <View className="flex flex-row justify-between mb-2">
              <Text className="text-base font-bold">{cartItem.data.title}</Text>
              <Text className="text-base">{formatDateCZ(cartItem.data.plannedBuy)}</Text>
            </View>
          </TouchableOpacity>
          <View className="border-[0.25px] border-slate-400 w-[80%] mx-auto" />
        </View>
      ))
      }
    </View>
  )
}