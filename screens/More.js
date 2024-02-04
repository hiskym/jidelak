import { View, Text, Button } from 'react-native'
import React from 'react'

//screen for settings and about
export default function More({navigation}) {
  return (
    <View className="flex-1 top-10">

      <Button title='Nastavení' onPress={() => navigation.navigate("Settings")}/>
      <Button title='O aplikaci' onPress={() => navigation.navigate("About")} />
    </View>
  )
}
