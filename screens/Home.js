import React from 'react'
import { Text, View, Image, TouchableOpacity } from 'react-native';

export default function Home({navigation}) {
  return (
    <View className="flex-1 items-center justify-evenly">
      <Image 
        style={{width: 400, height: 400, resizeMode: 'center', borderRadius: 20}} 
        source={require('../assets/images/splash.png')}
      />
      <View className="items-center gap-2">
      <TouchableOpacity onPress={() => navigation.navigate("LoginNavigation")} className="bg-teal-600 rounded-xl py-3 px-5">
              <Text className="text-xl text-white font-bold">Přihlásit se</Text>
            </TouchableOpacity>
      <Text className="text-lg text-slate-900">nebo</Text>
      <TouchableOpacity onPress={() => navigation.navigate("Root")} className="bg-orange-400 rounded-xl py-3 px-5">
              <Text className="text-xl text-white font-bold">Pokračovat bez přihlášení</Text>
            </TouchableOpacity>
      </View>
      
    </View>
    
  )
}
