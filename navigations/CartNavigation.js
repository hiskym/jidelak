import React from 'react'
import ShoppingList from '../screens/ShoppingList';
import CartHistory from '../screens/CartHistory';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import CartDetail from '../screens/CartDetail';

const Stack = createNativeStackNavigator()

export default function CartNavigation() {

  return (
    <Stack.Navigator>
      <Stack.Screen name="ShoppingList" component={ShoppingList} options={{ title: "Nákupní seznam", headerBackTitleVisible: false, headerTitleAlign: 'center' }} />
      <Stack.Screen name="CartHistory" component={CartHistory} options={{ title: "Uložené nákupní seznamy", headerBackTitleVisible: false, headerTitleAlign: 'center' }} />
      <Stack.Screen name="CartDetail" options={{ title: "Detail seznamu", headerBackTitleVisible: false, headerTitleAlign: 'center' }}>
        {(props) => <CartDetail {...props} />
        }
      </Stack.Screen>
    </Stack.Navigator>
  )
}