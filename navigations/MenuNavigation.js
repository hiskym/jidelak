import { View, Text } from 'react-native'
import React from 'react'
import Login from '../screens/Login';
import { createNativeStackNavigator} from '@react-navigation/native-stack'
import Menu from '../screens/Menu';
import MenuLocked from '../screens/MenuLocked';
import LoginNavigation from './LoginNavigation';
import Meal from '../screens/Meal';
import { useUserStore } from '../store/UserStore';

const Stack = createNativeStackNavigator()

export default function MenuNavigation() {
  const backTitle = "Zpět";

  const {user} = useUserStore();

  return (
    <Stack.Navigator>
        {!user ? (<Stack.Screen name="Menu" component={MenuLocked} options={{ title: "Jídelníček" }} />
                ) :(
                  <>
              <Stack.Screen name="Menu" options={{ title: "Jídelníček" }}>
                {(props) => <Menu {...props} />}
              </Stack.Screen>
              <Stack.Screen name="Meal" options={{title: "Detail receptu", headerBackTitle: backTitle}}>
                {(props) => <Meal {...props} />
            }
        </Stack.Screen>
            </>
            )}
        <Stack.Screen name="LoginNavigation" options={{ title: "Přihlášení"}}>
            {(props) => <LoginNavigation {...props} />}
        </Stack.Screen>
    </Stack.Navigator>
  )
}