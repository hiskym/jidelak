import { View, Text } from 'react-native'
import React from 'react'
import { Link } from '@react-navigation/native'

export default function MenuLocked() {
  return (
    <View>
      <View className="m-2 flex flex-col top-5 flex-shrink">
        <Text className="text-2xl">Zde si můžete plánovat jídelníček, nebo si vybrat některý z předpřipravených. Pro používání těchto funkcionalit se však <Link to={{screen: 'LoginNavigation'}}><Text className="text-blue-500">musíte přihlásit.</Text></Link></Text>
      </View>
    </View>
  )
}