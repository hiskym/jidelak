import React from 'react'
import { Text, View, Button, Image, TouchableOpacity } from 'react-native';

export default function Home({navigation}) {
  return (
    <View className="flex-1 items-center justify-evenly">
      <Image 
        style={{width: 400, height: 400, resizeMode: 'center', borderRadius: 20}} 
        source={require('../assets/images/splash.png')}
      />
      <View className="items-center gap-2">
      <TouchableOpacity title='Přihlásit se' onPress={() => navigation.navigate("LoginNavigation")}>
        <Text className="text-xl text-blue-500 font-bold">Přihlásit se</Text>
      </TouchableOpacity>
      <Text className="text-lg">nebo</Text>
      <TouchableOpacity title='Pokračovat bez přihlášení' onPress={() => navigation.navigate("Root")}>
        <Text className="text-xl text-blue-500 font-bold">Pokračovat bez přihlášení</Text>
      </TouchableOpacity>
      </View>
      
    </View>
    
  )
}
