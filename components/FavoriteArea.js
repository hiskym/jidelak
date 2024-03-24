import { View, TouchableOpacity } from 'react-native'
import React from 'react'
import RecipeCard from './RecipeCard'

export default function FavoriteArea({ favorites, navigation }) {
    return (
        <View className="flex flex-row flex-wrap justify-evenly mt-4">
            {favorites.map((favorite) => {
                return (
                    <TouchableOpacity key={favorite.recipeId} onPress={() => { navigation.navigate('FavoriteDetail', favorite) }}>
                        <RecipeCard
                            image={favorite.data.image}
                            name={favorite.data.name}
                        />
                    </TouchableOpacity>
                )
            })}
        </View>
    )
}