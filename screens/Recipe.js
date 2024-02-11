import { View, Text, Image, FlatList, Button, Alert } from 'react-native'
import Checkbox from 'expo-checkbox';
import React from 'react'
import { ScrollView } from 'react-native';
import { useState } from 'react';
import IconButton from '../components/IconButton';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Recipe({ route, cart, setCart, favorites, setFavorites }) {

    const { name, alergens, category, cook_time, description, diet, image, ingredients, nutrition, prepare_time, servings, steps, price } = route.params.data;
    const { id } = route.params.id

    // console.log(route.params.data)

    const [checkedSteps, setCheckedSteps] = useState(new Array(steps.length).fill(false));

    const handleCheckboxChange = (index) => {
        const updatedCheckedSteps = [...checkedSteps];
        updatedCheckedSteps[index] = !updatedCheckedSteps[index];
        setCheckedSteps(updatedCheckedSteps);
    };

    const addToCart = async () => {
        try {
            const updatedCart = [...cart];
            ingredients.forEach((ingredient) => {
                const existingItem = updatedCart.findIndex((item) =>
                    item.title === ingredient.title && item.unit === ingredient.unit
                );

                if (existingItem !== -1) {
                    const updatedIngredient = { ...ingredient };
                    updatedIngredient.amount += updatedCart[existingItem].amount;
                    updatedCart[existingItem] = updatedIngredient;
                } else {
                    updatedCart.push(ingredient);
                }
            });

            await AsyncStorage.setItem('shoppingList', JSON.stringify(updatedCart));
            setCart(updatedCart);
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    const addToFavorites = async () => {
        try {
            const recipeToAdd = route.params.data;
            const recipeId = route.params.id

            const isAlreadyInFavorites = favorites.some(favorite => favorite.id === recipeId);

            if (isAlreadyInFavorites) {
                return (
                    Alert.alert(
                        'Nelze přidat',
                        'Recept je již označen jako oblíbený', [
                        {
                            text: 'OK',
                            onPress: () => console.log('Recipe already exists in favorites.')
                        }
                    ])
                )
            }

            const favoriteRecipe = { id: recipeId, data: recipeToAdd }

            updatedFavorites = [favoriteRecipe, ...favorites]

            await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
            setFavorites(updatedFavorites);

            // console.log(favorites)
        } catch (error) {
            console.error('Error adding to favorites:', error);
        }
    }

    // console.log(route.params.data)

    return (
        <ScrollView className="flex flex-col" nestedScrollEnabled={true}>
            <View className="justify-center items-center top-4 gap-3 flex flex-1">
                <Text className="text-3xl font-bold">{name}</Text>
                <Image style={{ width: 200, height: 200, resizeMode: 'center', borderRadius: 40 }} source={{ uri: image }} />
                <Text className="text-xl flex flex-shrink mx-3">{description}</Text>

                {/* like button, addToCart button, menu button -> pridat funkce */}
                <View className="flex-row">
                    <IconButton icon={"heart"} onPress={() => addToFavorites()} />
                    <IconButton icon={"restaurant"} onPress={() => {}} />
                    <IconButton icon={"cart"} onPress={() => addToCart()} />
                </View>

                <View className="flex-row gap-3">
                    <Text>Příprava: {prepare_time} min</Text>
                    <Text>Vaření: {cook_time} min</Text>
                    <Text>Porce: {servings}</Text>
                    <Text>Cena: ~{price} Kč</Text>
                </View>

                <View className="flex flex-1 gap-2 border rounded-lg">
                    <Text className="font-bold text-lg">Ingredience:</Text>
                    <FlatList
                        data={ingredients}
                        renderItem={({ item }) => (
                            <View className="flex flex-row items-center w-96 m-1 left-2">
                                <Text>{item.amount} {item.unit} {item.title}</Text>
                            </View>
                        )}
                        scrollEnabled={false}
                    />

                </View>
                <View className="flex flex-1 gap-2 border rounded-lg">
                    <Text className="font-bold text-lg">Výživové hodnoty:</Text>
                    <FlatList
                        data={nutrition}
                        renderItem={({ item }) => (
                            <View className="flex flex-row items-center w-96 m-1 left-2">
                                <Text>{item.title} {item.amount}</Text>
                            </View>
                        )}
                        scrollEnabled={false}
                    />
                </View>

                <View className="flex flex-1 gap-2 border rounded-lg">
                    <Text className="font-bold text-lg">Postup:</Text>
                    <FlatList
                        data={steps}
                        renderItem={({ item, index }) => (
                            <View className="flex flex-row items-center w-96 m-1">
                                <Checkbox value={checkedSteps[index]} onValueChange={() => handleCheckboxChange(index)} className="m-2" />
                                <Text className="flex flex-shrink">{item}</Text>
                            </View>
                        )}
                        keyExtractor={(item, index) => index.toString()}
                        scrollEnabled={false}
                    />
                </View>
                <View className="gap-1 w-96">
                    <Text className="font-bold">Alergeny: {alergens.length > 1 ? alergens.join(', ') : alergens}</Text>
                    <Text>Kategorie: {category.length > 1 ? category.join(', ') : category}</Text>
                    <Text>Stravování: {diet.length > 1 ? diet.join(', ') : diet}</Text>
                    <Text className="font-bold text-xs mt-5">Přibližná cena a výživové hodnoty jsou vždy uvedeny pro 1 porci.</Text>
                </View>

                {/* bottom empty area */}
                <View className="h-5"></View>
            </View>
        </ScrollView>
    )
}