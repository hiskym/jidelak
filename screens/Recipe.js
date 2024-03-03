import { View, Text, Image, FlatList, ActivityIndicator } from 'react-native'
import Checkbox from 'expo-checkbox';
import React from 'react'
import { ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import IconButton from '../components/IconButton';
import MenuAddDetails from '../components/MenuAddDetails';
import { useCartStore } from '../store/CartStore';
import { useUserStore } from '../store/UserStore';
import { fetchRecipeData, fetchRecipeIngredients } from '../utils/recipeUtils';
import { handleCheckboxChange } from '../utils/checkboxUtils';
import { handleAddToCartRecipe } from '../utils/CartUtils';
import { addToFavorites } from '../utils/FavoriteUtils';
import { translateNutrition } from '../utils/recipeUtils';

export default function Recipe({ route }) {

    const { user } = useUserStore();

    const { addToCartRecipe } = useCartStore();

    // const { name, alergens, category, cook_time, description, diet, image, ingredients, nutrition, prepare_time, servings, steps, price } = route.params.data;
    // const { id } = route.params.id

    const [recipeData, setRecipeData] = useState(null);
    const [recipeIngredients, setRecipeIngredients] = useState(null)
    const [checkedSteps, setCheckedSteps] = useState([]);

    useEffect(() => {
        fetchRecipeData(route.params.id, setRecipeData, setCheckedSteps);
        fetchRecipeIngredients(route.params.id, setRecipeIngredients);
    }, [route.params.id]);

    // ----- veci pro pridani do menu

    const [showDetails, setShowDetails] = useState(false);

    const handleShowDetails = () => {
        setShowDetails(true);

    }

    if (!recipeData) {
        return <ActivityIndicator size="small" color="tomato" className="flex-1 justify-center rounded-sm scale-150" />;
    }

    const { name, alergens, category, cook_time, description, diet, image, nutrition, prepare_time, servings, steps, price } = recipeData;


    return (
        <ScrollView className="flex flex-col" nestedScrollEnabled={true}>
            <View className="justify-center items-center top-4 gap-3 flex flex-1">
                <Text className="text-3xl font-bold">{name}</Text>
                <Image style={{ width: 200, height: 200, resizeMode: 'center', borderRadius: 40 }} source={{ uri: image }} />
                <Text className="text-xl flex flex-shrink mx-3">{description}</Text>

                {/* like button, addToCart button, menu button -> pridat funkce */}
                <View className="flex-row">
                    <IconButton icon={"heart"} onPress={() => addToFavorites(route.params.id, user.uid)} />
                    <IconButton icon={"restaurant"} onPress={handleShowDetails} />
                    <IconButton icon={"cart"} onPress={() => handleAddToCartRecipe(recipeIngredients, addToCartRecipe )} />
                </View>
                {/* detaily */}
                {showDetails && (
                    <MenuAddDetails
                        showDetails={showDetails}
                        setShowDetails={setShowDetails}
                        recipeId={route.params.id}
                        userId={user.uid}
                    />
                )}
                {/* detaily konec */}
                <View className="flex-row gap-3">
                    <Text>Příprava: {prepare_time} min</Text>
                    <Text>Vaření: {cook_time} min</Text>
                    <Text>Porce: {servings}</Text>
                    <Text>Cena: ~{price} Kč</Text>
                </View>

                <View className="flex flex-1 gap-2 border rounded-lg">
                    <Text className="font-bold text-lg">Ingredience:</Text>
                    {!recipeIngredients ? (
                        <View className="flex flex-row items-center w-96 m-1 left-2">
                            <ActivityIndicator size="small" color="tomato" className="flex-1 justify-center rounded-sm scale-150 p-4" />
                        </View>
                    ) : (
                        <FlatList
                            data={recipeIngredients}
                            renderItem={({ item }) => (
                                <View className="flex flex-row items-center w-96 m-1 left-2">
                                    <Text>{item.amount} {item.unit} {item.title}</Text>
                                </View>
                            )}
                            scrollEnabled={false}
                        />
                    )}
                </View>
                <View className="flex flex-1 gap-2 border rounded-lg">
                    <Text className="font-bold text-lg">Výživové hodnoty:</Text>
                    <FlatList
                        data={Object.entries(nutrition).sort(([keyA], [keyB]) => keyA.localeCompare(keyB))}
                        renderItem={({ item }) => (
                            <View className="flex flex-row items-center w-96 m-1 left-2">
                                <Text>{translateNutrition[item[0]]}: {item[0] === "calories" ? ` ${item[1]} kcal` : ` ${item[1]} g`}</Text>
                            </View>
                        )}
                        keyExtractor={(item, index) => index.toString()}
                        scrollEnabled={false}
                    />
                </View>

                <View className="flex flex-1 gap-2 border rounded-lg">
                    <Text className="font-bold text-lg">Postup:</Text>
                    <FlatList
                        data={steps}
                        renderItem={({ item, index }) => (
                            <View className="flex flex-row items-center w-96 m-1">
                                <Checkbox value={checkedSteps[index]} onValueChange={() => handleCheckboxChange(index, checkedSteps, setCheckedSteps)} className="m-2" />
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