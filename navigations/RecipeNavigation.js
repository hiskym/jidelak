import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator} from '@react-navigation/native-stack'
import Recipes from '../screens/Recipes';
import Recipe from '../screens/Recipe';

const Stack = createNativeStackNavigator()

export default function RecipeNavigation() {

    const backTitle = "Zpět";

  return (
    <Stack.Navigator>
        <Stack.Screen name="Recipes" component={Recipes} options={{title: "Recepty"}} />
        <Stack.Screen name="RecipeDetail" options={{title: "Detail receptu", headerBackTitle: backTitle}}>
          {(props) => <Recipe {...props} />
            }
        </Stack.Screen>
    </Stack.Navigator>
  )
}

