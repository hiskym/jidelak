import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator} from '@react-navigation/native-stack'
import Favorites from '../screens/Favorites';
import Favorite from '../screens/Favorite';

const Stack = createNativeStackNavigator()

export default function FavoriteNavigation({favorites, setFavorites, cart, setCart}) {

    const backTitle = "Zpět";

  return (
    <Stack.Navigator>
        <Stack.Screen name="Favorites" options={{title: "Oblíbené"}}>
          {(props) => <Favorites {...props} favorites={favorites} setFavorites={setFavorites} />}
        </Stack.Screen>
        <Stack.Screen name="FavoriteDetail" options={{title: "Detail receptu", headerBackTitle: backTitle}}>
          {(props) => <Favorite {...props} favorites={favorites} setFavorites={setFavorites} cart={cart} setCart={setCart} />}
        </Stack.Screen>
    </Stack.Navigator>
  )
}

