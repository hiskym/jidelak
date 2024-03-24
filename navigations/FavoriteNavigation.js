import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Favorites from '../screens/Favorites';
import Favorite from '../screens/Favorite';
import FavoritesLocked from '../screens/FavoritesLocked';
import LoginNavigation from './LoginNavigation';
import { useUserStore } from '../store/UserStore';

const Stack = createNativeStackNavigator()

export default function FavoriteNavigation() {

  const { user } = useUserStore();

  return (
    <Stack.Navigator>
      {!user ? (<Stack.Screen name="FavoriteLocked" options={{ title: "Oblíbené", headerTitleAlign: 'center' }}>
        {(props) => <FavoritesLocked {...props} />}
      </Stack.Screen>) : (
        <Stack.Screen name="Favorites" options={{ title: "Oblíbené", headerBackTitleVisible: false, headerTitleAlign: 'center' }}>
          {(props) => <Favorites {...props} />}
        </Stack.Screen>
      )}
      <Stack.Screen name="FavoriteDetail" options={{ title: "Detail receptu", headerBackTitleVisible: false, headerTitleAlign: 'center' }}>
        {(props) => <Favorite {...props} />}
      </Stack.Screen>
      <Stack.Screen name="LoginNavigation" options={{ title: "Přihlášení", headerShown: false }}>
        {(props) => <LoginNavigation {...props} />}
      </Stack.Screen>
    </Stack.Navigator>
  )
}