import { View, Text } from 'react-native'
import React from 'react'
import Settings from "../screens/Settings";
import About from "../screens/About";
import { createNativeStackNavigator} from '@react-navigation/native-stack'
import More from '../screens/More';
import LoginNavigation from './LoginNavigation';
import Home from '../screens/Home';
import Survey from '../screens/Survey';

const Stack = createNativeStackNavigator()

export default function MoreNavigation() {

    const backTitle = "Zpět";

  return (
    <Stack.Navigator>
        <Stack.Screen name="More" options={{title: "Více"}}>
          {(props) => <More {...props} />}
        </Stack.Screen>
        <Stack.Screen name="Settings" component={Settings} options={{title: "Nastavení", headerBackTitle: backTitle}} />
        {/* testing place for survey */}
        <Stack.Screen name="Survey" component={Survey} options={{title: "Vaše údaje", headerBackVisible: false, gestureEnabled: false}} />
        <Stack.Screen name="About" component={About} options={{title: "O aplikaci", headerBackTitle: backTitle}} />
        <Stack.Screen name="LoginNavigation" options={{title: "Přihlášení", headerBackTitle: backTitle}}>
          {(props) => <LoginNavigation {...props} />}
        </Stack.Screen>
        <Stack.Screen name="Home" component={Home} options={{title: "Jídelák"}} />
    </Stack.Navigator>
  )
}

