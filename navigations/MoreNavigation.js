import { View, Text } from 'react-native'
import React from 'react'
import Settings from "../screens/Settings";
import About from "../screens/About";
import { createNativeStackNavigator} from '@react-navigation/native-stack'
import More from '../screens/More';

const Stack = createNativeStackNavigator()

export default function MoreNavigation() {

    const backTitle = "Zpět";

  return (
    <Stack.Navigator>
        <Stack.Screen name="More" component={More} options={{title: "Více"}} />
        <Stack.Screen name="Settings" component={Settings} options={{title: "Nastavení", headerBackTitle: backTitle}} />
        <Stack.Screen name="About" component={About} options={{title: "O aplikaci", headerBackTitle: backTitle}} />
    </Stack.Navigator>
  )
}

