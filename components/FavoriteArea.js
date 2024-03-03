import { View, TouchableOpacity, Button } from 'react-native'
import React from 'react'
import FavoriteCard from './RecipeCard'

export default function FavoriteArea({ favorites, navigation }) {
    return (
        <View className="flex flex-row flex-wrap p-4 justify-between">
            {favorites.map((favorite) => {
                return (
                    <TouchableOpacity key={favorite.recipeId} onPress={() => { navigation.navigate('FavoriteDetail', favorite) }}>
                        <FavoriteCard
                            id={favorite.recipeId}
                            image={favorite.data.image}
                            name={favorite.data.name}
                            description={favorite.data.description}
                        />
                    </TouchableOpacity>
                )
            })}
        </View>
    )
}