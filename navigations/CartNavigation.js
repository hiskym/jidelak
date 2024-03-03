import { View, Text } from 'react-native'
import React from 'react'
import ShoppingList from '../screens/ShoppingList';
import CartHistory from '../screens/CartHistory';
import { createNativeStackNavigator} from '@react-navigation/native-stack'
import CartDetail from '../screens/CartDetail';

const Stack = createNativeStackNavigator()

export default function CartNavigation() {

    const backTitle = "Zpět";

  return (
    <Stack.Navigator>
        <Stack.Screen name="ShoppingList" component={ShoppingList} options={{title: "Nákupní seznam"}} />
        <Stack.Screen name="CartHistory" component={CartHistory} options={{title: "Uložené nákupní seznamy", headerBackTitle: backTitle}} />
        <Stack.Screen name="CartDetail" options={{title: "Detail seznamu", headerBackTitle: backTitle}}>
        {(props) => <CartDetail {...props} />
            }
        </Stack.Screen>
    </Stack.Navigator>
  )
}