import { View, Text } from 'react-native'
import React from 'react'
import LoginNavigation from './LoginNavigation';
import Root from './Root';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Home from '../screens/Home';
import { useUserStore } from '../store/UserStore';

const Stack = createNativeStackNavigator();

export default function AppNavigation() {

const {user} = useUserStore();

  return (
    <NavigationContainer>
        <Stack.Navigator>
            {!user ? <Stack.Screen name="Home" component={Home} options={{title: "Jídelák"}} />
             : (
                null
            )}
            <Stack.Screen name="Root" options={{headerShown: false, title: "Root"}}>
                {() => <Root />
                }
            </Stack.Screen>
            <Stack.Screen name='LoginNavigation' options={{headerShown: false, title: "LoginNavigation"}}>
                {() => <LoginNavigation />}
            </Stack.Screen>
            
        </Stack.Navigator>
    </NavigationContainer>
  )
}