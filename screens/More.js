import { View, Text, Button, Alert, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FIREBASE_AUTH } from '../firebaseConfig'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useUserStore } from '../store/UserStore'
import { usersRef } from '../firebaseConfig'
import { doc, getDoc } from 'firebase/firestore'
import { useCartStore } from '../store/CartStore'
import { clearCache } from '../utils/cacheUtils'

//screen for settings and about
export default function More({ navigation }) {

  const { user } = useUserStore();

  const { setCart } = useCartStore();

  const [username, setUsername] = useState('');

  useEffect(() => {
    if (user && user.uid) {
      getUsername();
    }

  }, [user])

  const getUsername = async () => {
    try {
      const userDoc = doc(usersRef, user.uid);
      const userDocSnapshot = await getDoc(userDoc);
      if (userDocSnapshot.exists()) {
        const username = userDocSnapshot.data().name;

        const newUsername = username || '';

        setUsername(newUsername);
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleLogout = () => {
    try {
      Alert.alert('Odhlášení', 'Opravdu se chcete odhlásit?', [
        {
          text: 'Zrušit',
          onPress: () => console.log('Cancel Pressed'),
        },
        {
          text: 'OK',
          onPress: async () => {
            await clearCache();
            FIREBASE_AUTH.signOut()
            await AsyncStorage.removeItem('user');
            setCart([])
          }
        },
      ])
    } catch (error) {
      console.error('error:', error);
    }


  }

  return (
    <View className="flex-1 items-center bg-white">
      {user && (
        <View className="bg-teal-50 w-full mb-5 py-4 rounded-b-2xl shadow-sm">
          <Text className="text-center m-2 font-bold text-2xl text-slate-900">{username}</Text>
          <Text className="text-center m-2 text-slate-900">{user.email}</Text>
        </View>
      )}
      <TouchableOpacity onPress={() => navigation.navigate("About")}>
        <Text className="text-xl text-blue-500 font-semibold pt-2">O aplikaci</Text>
      </TouchableOpacity>
      <View className="border-[0.5px] border-slate-300 w-[60%] m-3" />

      {!user ? (
        <TouchableOpacity onPress={() => navigation.navigate("LoginNavigation")}>
          <Text className="text-xl text-blue-500 font-semibold">Přihlášení</Text>
        </TouchableOpacity>
      ) : (
        <>
          <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
            <Text className="text-xl text-blue-500 font-semibold">Nastavení</Text>
          </TouchableOpacity>
          <View className="border-[0.5px] border-slate-300 w-[60%] m-3" />
          <TouchableOpacity onPress={() => navigation.navigate("Survey")}>
            <Text className="text-xl text-blue-500 font-semibold">Dotazník</Text>
          </TouchableOpacity>
          <View className="border-[0.5px] border-slate-300 w-[60%] m-3" />
          <TouchableOpacity onPress={() => handleLogout()}>
            <Text className="text-xl text-blue-500 font-semibold">Odhlásit se</Text>
          </TouchableOpacity>
        </>
      )}

    </View>
  )
}
