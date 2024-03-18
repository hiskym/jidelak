import { View, TouchableOpacity } from 'react-native'
import React from 'react'
import RecipeCard from './RecipeCard'

export default function RecipeArea({ recipes, navigation }) {

    return (
        <View className="flex flex-row flex-wrap justify-center">
            {recipes.map((recipe) => {
                return (
                    <TouchableOpacity key={recipe.id} onPress={() => {navigation.navigate('RecipeDetail', recipe)}}>
                        <RecipeCard
                            image={recipe.data.image}
                            name={recipe.data.name}
                        />
                    </TouchableOpacity>
                )
            })}
        </View>
    )
}