import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Recipes from '../screens/Recipes';
import Recipe from '../screens/Recipe';

const Stack = createNativeStackNavigator()

export default function RecipeNavigation() {

  return (
    <Stack.Navigator>
      <Stack.Screen name="Recipes" component={Recipes} options={{ title: "Recepty", headerBackTitleVisible: false, headerTitleAlign: 'center' }} />
      <Stack.Screen name="RecipeDetail" options={{ title: "Detail receptu", headerBackTitleVisible: false, headerTitleAlign: 'center' }}>
        {(props) => <Recipe {...props} />
        }
      </Stack.Screen>
    </Stack.Navigator>
  )
}