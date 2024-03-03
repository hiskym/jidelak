import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Login from '../screens/Login'
import Register from '../screens/Register'

const Stack = createNativeStackNavigator();

export default function LoginNavigation() {
  return (
    <Stack.Navigator>
        <Stack.Screen name="Login" options={{title: "Přihlášení", headerShown: false}}>
            {(props) => <Login {...props} />}
        </Stack.Screen>
        <Stack.Screen name="Register" options={{title: "Registrace", headerShown: false}}>
            {(props) => <Register {...props} />}
        </Stack.Screen>
    </Stack.Navigator>
  )
}