import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Login from '../screens/Login'
import Register from '../screens/Register'
import Survey from '../screens/Survey'

const Stack = createNativeStackNavigator();

export default function LoginNavigation() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" options={{ title: "Přihlášení", headerBackTitleVisible: false, headerTitleAlign: 'center' }}>
        {(props) => <Login {...props} />}
      </Stack.Screen>
      <Stack.Screen name="Register" options={{ title: "Registrace", headerBackVisible: false, gestureEnabled: false, headerTitleAlign: 'center' }}>
        {(props) => <Register {...props} />}
      </Stack.Screen>
      <Stack.Screen name="Survey" options={{ title: "Vaše údaje", headerBackVisible: false, gestureEnabled: false, headerTitleAlign: 'center' }}>
        {(props) => <Survey {...props} />}
      </Stack.Screen>
    </Stack.Navigator>
  )
}