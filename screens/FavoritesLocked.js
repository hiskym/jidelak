import { View, Text } from 'react-native'
import React from 'react'
import { Link } from '@react-navigation/native'

export default function FavoritesLocked() {
  return (
    <View>
      <View className="flex flex-col top-5 flex-shrink items-center mx-2">
        <Text className="text-2xl text-slate-900">Zde se zobrazují vaše oblíbené recepty. Pro ukládání a zobrazení se však <Link to={{ screen: 'LoginNavigation' }}><Text className="text-blue-500">musíte přihlásit.</Text></Link></Text>
      </View>
    </View>
  )
}