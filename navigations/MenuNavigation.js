import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Menu from '../screens/Menu';
import MenuLocked from '../screens/MenuLocked';
import LoginNavigation from './LoginNavigation';
import Meal from '../screens/Meal';
import { useUserStore } from '../store/UserStore';
import MealsHistory from '../screens/MealsHistory';
import Analytics from '../screens/Analytics';
import Survey from '../screens/Survey';

const Stack = createNativeStackNavigator()

export default function MenuNavigation() {

  const { user } = useUserStore();

  return (
    <Stack.Navigator>
      {!user ? (<Stack.Screen name="Menu" component={MenuLocked} options={{ title: "Jídelníček", headerTitleAlign: 'center' }} />
      ) : (
        <>
          <Stack.Screen name="Menu" options={{ title: "Jídelníček", headerBackTitleVisible: false, headerTitleAlign: 'center' }}>
            {(props) => <Menu {...props} />}
          </Stack.Screen>
          <Stack.Screen name="MealDetail" options={{ title: "Detail receptu", headerBackTitleVisible: false, headerTitleAlign: 'center' }}>
            {(props) => <Meal {...props} />
            }
          </Stack.Screen>
          <Stack.Screen name="MealsHistory" options={{ title: "Historie", headerBackTitleVisible: false, headerTitleAlign: 'center' }}>
            {(props) => <MealsHistory {...props} />}
          </Stack.Screen>
          <Stack.Screen name="Analytics" options={{ title: "Statistiky", headerBackTitleVisible: false, headerTitleAlign: 'center' }}>
            {(props) => <Analytics {...props} />}
          </Stack.Screen>
          <Stack.Screen name="Survey" options={{ title: "Vaše údaje", headerBackTitleVisible: false, headerTitleAlign: 'center' }}>
            {(props) => <Survey {...props} />}
          </Stack.Screen>
        </>
      )}
      <Stack.Screen name="LoginNavigation" options={{ title: "Přihlášení", headerBackTitleVisible: false, headerShown: false }}>
        {(props) => <LoginNavigation {...props} />}
      </Stack.Screen>
    </Stack.Navigator>
  )
}