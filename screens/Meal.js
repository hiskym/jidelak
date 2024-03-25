import { View, Text, Image, FlatList, ActivityIndicator, Alert } from 'react-native'
import Checkbox from 'expo-checkbox';
import React from 'react'
import { ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import IconButton from '../components/IconButton';
import { useCartStore } from '../store/CartStore';
import { useUserStore } from '../store/UserStore';
import { fetchRecipeData, fetchRecipeIngredients } from '../utils/recipeUtils';
import { handleCheckboxChange } from '../utils/checkboxUtils';
import { handleAddToCartRecipe } from '../utils/CartUtils';
import { addToFavorites } from '../utils/FavoriteUtils';
import { translateNutrition, translateAlergens, translateCategory } from '../utils/recipeUtils';
import { removeFromMenu } from '../utils/menuUtils';

export default function Meal({ route, navigation }) {
    const { user } = useUserStore();

    const { addToCartRecipe } = useCartStore();

    const { id } = route.params.mealId;

    const [recipeData, setRecipeData] = useState(null);
    const [recipeIngredients, setRecipeIngredients] = useState(null)
    const [checkedSteps, setCheckedSteps] = useState([]);

    useEffect(() => {
        fetchRecipeData(route.params.recipeId, setRecipeData, setCheckedSteps);
        fetchRecipeIngredients(route.params.recipeId, setRecipeIngredients);
    }, [route.params.recipeId]);

    const handleRemove = () => {
        Alert.alert(
            'Odebrání z jídelníčku',
            'Opravdu chcete odebrat recept z jídelníčku?', [
            {
                text: 'Zrušit',
                onPress: () => console.log('Meal not removed')
            },
            {
                text: 'OK',
                onPress: () => {
                    removeFromMenu(route.params.mealId);
                    navigation.goBack();
                }
            }
        ])
    }

    if (!recipeData) {
        return <ActivityIndicator size="small" color="tomato" className="flex-1 justify-center rounded-sm scale-150" />;
    }

    const { name, alergens, category, cook_time, description, diet, image, nutrition, prepare_time, servings, steps, price } = recipeData;


    return (
        <ScrollView className="flex flex-col" nestedScrollEnabled={true}>
            <View className="justify-center items-center flex flex-1">
                <View className="relative w-full h-[200px] items-center">
                    <Image style={{ width: '100%', height: '100%', resizeMode: 'cover', borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }} source={{ uri: image }} />
                </View>
                <Text className="text-3xl font-bold my-2 text-slate-900">{name}</Text>
                <Text className="text-xl flex flex-shrink mx-3 mb-3 text-slate-900 w-[90%] text-center">{description}</Text>
                <Text className="text-lg flex flex-shrink mx-3 mb-3 text-slate-900 w-[90%] text-center">Poznámka: {route.params.note}</Text>

                <View className="flex-row my-3">
                    <IconButton icon={"heart"} onPress={() => addToFavorites(route.params.recipeId, user.uid)} />
                    <IconButton icon={"trash"} onPress={() => handleRemove()} />
                    <IconButton icon={"cart"} onPress={() => handleAddToCartRecipe(recipeIngredients, addToCartRecipe)} />
                </View>
                <View className="flex-row my-3 w-[90%] flex-wrap justify-center">
                    <Text className="mr-2 text-slate-900">Příprava: {prepare_time} min</Text>
                    <Text className="mr-2 text-slate-900">Vaření: {cook_time} min</Text>
                    <Text className="mr-2 text-slate-900">Porce: {servings}</Text>
                    {/* <Text className="text-slate-900">Cena: ~{price} Kč</Text> */}
                </View>
                <View className="border-[0.5px] w-[60%] border-slate-300" />
                <View className="flex flex-1 my-2 p-2 w-[90%]">
                    <Text className="font-bold text-lg text-slate-900">Ingredience:</Text>
                    {!recipeIngredients ? (
                        <View className="flex flex-row items-center m-1 left-2">
                            <ActivityIndicator size="small" color="tomato" className="flex-1 justify-center rounded-sm scale-150 p-4" />
                        </View>
                    ) : (
                        <FlatList
                            data={recipeIngredients}
                            renderItem={({ item }) => (
                                <View className="flex flex-row items-center m-1 mb-2 left-2 justify-between w-[90%]">
                                    <Text className="text-slate-900">• {item.title}</Text>
                                    <Text className="text-slate-900">{item.amount} {item.unit} </Text>
                                </View>
                            )}
                            scrollEnabled={false}
                        />
                    )}
                </View>
                <View className="border-[0.5px] w-[60%] border-slate-300" />
                <View className="flex flex-1 my-2 p-2 w-[90%]">
                    <Text className="font-bold text-lg text-slate-900">Výživové hodnoty:</Text>
                    <FlatList
                        data={Object.entries(nutrition).sort(([keyA], [keyB]) => keyA.localeCompare(keyB))}
                        renderItem={({ item }) => (
                            <View className="flex flex-row items-center m-1 left-2 justify-between w-[90%]">
                                <Text className="text-slate-900">• {translateNutrition[item[0]]}</Text>
                                <Text className="text-slate-900">{item[0] === "calories" ? ` ${item[1]} kcal` : ` ${item[1]} g`}</Text>
                            </View>
                        )}
                        keyExtractor={(item, index) => index.toString()}
                        scrollEnabled={false}
                    />
                </View>

                <View className="border-[0.5px] w-[60%] border-slate-300" />
                <View className="flex flex-1 my-2 p-2 w-[90%]">
                    <Text className="font-bold text-lg text-slate-900">Postup:</Text>
                    <FlatList
                        data={steps}
                        renderItem={({ item, index }) => (
                            <View className="flex flex-row items-center m-1">
                                <Checkbox value={checkedSteps[index]} onValueChange={() => handleCheckboxChange(index, checkedSteps, setCheckedSteps)} className="m-2" />
                                <Text className="flex flex-shrink text-slate-900">{item}</Text>
                            </View>
                        )}
                        keyExtractor={(item, index) => index.toString()}
                        scrollEnabled={false}
                    />
                </View>
                <View className="border-[0.5px] w-[60%] border-slate-300" />
                <View className="flex flex-1 my-2 p-2 w-[90%]">
                    <Text className="font-bold text-slate-900">Alergeny: {alergens.length > 1 ? alergens.map(alergen => translateAlergens[alergen]).join(', ') : translateAlergens[alergens]}</Text>
                    <Text className="text-slate-900">Kategorie: {category.length > 1 ? category.map(category => translateCategory[category]).join(', ') : translateCategory[category]}</Text>
                    <Text className="text-slate-900">Stravování: {diet.length > 1 ? diet.join(', ') : diet}</Text>
                    {/* <Text className="font-bold text-xs mt-5 text-slate-900">Přibližná cena a výživové hodnoty jsou vždy uvedeny pro 1 porci.</Text> */}
                    <Text className="font-bold text-xs mt-5 text-slate-900">Výživové hodnoty jsou vždy uvedeny pro 1 porci.</Text>
                </View>

                <View className="h-5"></View>
            </View>
        </ScrollView>
    )
}