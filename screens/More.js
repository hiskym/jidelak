import { View, Text, Button, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FIREBASE_AUTH } from '../firebaseConfig'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useUserStore } from '../store/UserStore'
import { usersRef } from '../firebaseConfig'
import { doc, getDoc } from 'firebase/firestore'

//screen for settings and about
export default function More({navigation}) {

  const {user} = useUserStore();

  const [username, setUsername] = useState(''); 

  useEffect(() => {
    if (user && user.uid) {
      getUsername();
    }
    
  }, [user])

  const getUsername = async () => {
    try {
      const userDoc = doc(usersRef, user.uid);
      const userDocSnapshot = await getDoc(userDoc);
      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();

        const newUsername = userData.name || '';

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
            await AsyncStorage.removeItem('user');
            FIREBASE_AUTH.signOut()
            // navigation.push("More")
            // setUser(null);
            // setFavorites([]);
          }
        },
      ])
    } catch (error) {
      console.error('error:', error);
    }
    
    
  }

  return (
    <View className="flex-1 top-10">
      {user && (
        <>
        <Text className="text-center m-2 font-bold text-2xl">{username}</Text>
        <Text className="text-center m-2">{user.email}</Text>
        </>
        )  }
      
      <Button title='O aplikaci' onPress={() => navigation.navigate("About")} />

      {/* adjust podle toho, zda je uzivatel prihlaseny */}
      {!user ? (
        <Button title='Přihlášení' onPress={() => navigation.navigate("LoginNavigation")} />
      ) : (
        <>
        <Button title='Nastavení' onPress={() => navigation.navigate("Settings")}/>
        <Button title='Dotazník' onPress={() => navigation.navigate("Survey")} />
        <Button title='Odhlásit se' onPress={() => handleLogout()} />
        </>
      )}
      
    </View>
  )
}
