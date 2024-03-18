import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { formatDateCZ } from '../utils/DateUtils';

export default function CartItems({ carts, navigation }) {

  return (
    <View className="flex flex-col items-center">
      <View className="flex flex-row justify-evenly mb-5 bg-teal-50 w-full py-5 rounded-b-2xl shadow-sm">
        <Text className="text-xl text-slate-900 font-bold">Název</Text>
        <Text className="text-xl text-slate-900 font-bold">Nákup</Text>

      </View>
      <View className="w-[90%]">
      {carts.map((cartItem) => (
        <View key={cartItem.id}>
          <TouchableOpacity  onPress={() => {navigation.navigate('CartDetail', cartItem) }}>
            <View className="flex flex-row justify-between mb-2">
              <Text className="text-base font-bold text-slate-900">{cartItem.data.title}</Text>
              <Text className="text-base text-slate-900">{formatDateCZ(cartItem.data.plannedBuy)}</Text>
            </View>
          </TouchableOpacity>
          {/* <View className="border-[0.25px] border-slate-400 w-[80%] mx-auto my-1" /> */}
        </View>
        ))
      }
      </View>
      
      
    </View>
  )
}