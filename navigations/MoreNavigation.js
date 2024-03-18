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

  return (
    <Stack.Navigator>
        <Stack.Screen name="More" options={{title: "Více", headerBackTitleVisible: false, headerTitleAlign: 'center'}}>
          {(props) => <More {...props} />}
        </Stack.Screen>
        <Stack.Screen name="Settings" component={Settings} options={{title: "Nastavení", headerBackTitleVisible: false, headerTitleAlign: 'center'}} />
        <Stack.Screen name="Survey" component={Survey} options={{title: "Vaše údaje", headerBackTitleVisible: false, gestureEnabled: false, headerTitleAlign: 'center'}} />
        <Stack.Screen name="About" component={About} options={{title: "O aplikaci", headerBackTitleVisible: false, headerTitleAlign: 'center'}} />
        <Stack.Screen name="LoginNavigation" options={{title: "Přihlášení", headerBackTitleVisible: false, gestureEnabled: false, headerShown: false}}>
          {(props) => <LoginNavigation {...props} />}
        </Stack.Screen>
        <Stack.Screen name="Home" component={Home} options={{title: "Jídelák"}} />
    </Stack.Navigator>
  )
}

