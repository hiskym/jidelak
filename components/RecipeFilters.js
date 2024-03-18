import { View, Text, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'
import { Picker } from '@react-native-picker/picker';
import IconButton from './IconButton';
import { timeValues, ingredientValues, caloriesValues, categoryValues  } from '../utils/PickerValues';
import { styles } from '../styles/GlobalStyles';


export default function RecipeFilters({ recipes, handleClearFilter, handleGetAllRecipes, setTimeQuery, setIngredient, setCalories, setCategory }) {

    const [showTimePicker, setShowTimePicker] = useState(false);

    const [showIngredientPicker, setShowIngredientPicker] = useState(false);

    const [showCaloriesPicker, setShowCaloriesPicker] = useState(false);

    const [showCategoryPicker, setShowCategoryPicker] = useState(false);

    const [time, setTime] = useState(0)

    const [selectedIngredient, setSelectedIngredient] = useState('');

    const [selectedCalories, setSelectedCalories] = useState(0);

    const [selectedCategory, setSelectedCategory] = useState('');

    const handleConfirm = (filterCategory) => {
        if (filterCategory === 'time' && time > 0) {
            setTimeQuery(time)
            setShowTimePicker(false)
            setTime(0);
        } else if (filterCategory === 'ingredient' && selectedIngredient !== '') {
            setIngredient(selectedIngredient);
            setShowIngredientPicker(false)
            setSelectedIngredient('');
        } else if (filterCategory === 'calories' && selectedCalories !== '') {
            setCalories(selectedCalories);
            setShowCaloriesPicker(false)
            setSelectedCalories(0);
        } else if (filterCategory === 'category' && selectedCategory !== '') {
            setCategory(selectedCategory);
            setShowCategoryPicker(false)
            setSelectedCategory('');
        } else {
            Alert.alert('Chyba!', 'Musíte vybrat možnost!', [
                { text: 'OK' }
            ])
        }
    }

    const handleCancel = (pickerCategory) => {
        if (pickerCategory === 'time') {
            setShowTimePicker(false)
        } else if (pickerCategory === 'ingredient') {
            setShowIngredientPicker(false)
        } else if (pickerCategory === 'calories'){
            setShowCaloriesPicker(false)
        } else if (pickerCategory === 'category') {
            setShowCategoryPicker(false)
        }
    }

    const handleShow = (pickerCategory) => {
        if (pickerCategory === 'time') {
            setShowTimePicker(true);
            setShowIngredientPicker(false)
            setShowCaloriesPicker(false)
            setShowCategoryPicker(false)
        } else if (pickerCategory === 'ingredient') {
            setShowIngredientPicker(true)
            setShowTimePicker(false);
            setShowCaloriesPicker(false)
            setShowCategoryPicker(false)
        } else if (pickerCategory === 'calories'){
            setShowCaloriesPicker(true)
            setShowCategoryPicker(false)
            setShowIngredientPicker(false)
            setShowTimePicker(false);
        } else if (pickerCategory === 'category') {
            setShowCategoryPicker(true)
            setShowIngredientPicker(false)
            setShowTimePicker(false);
            setShowCaloriesPicker(false)
        }
    }

    return (
        <View className="mb-2">
            <View className="flex-row justify-center my-5">
                {recipes.length === 0 && (
                    <IconButton icon="book" onPress={handleGetAllRecipes} />
                )}

                {recipes.length === 0 && (
                    <IconButton icon="nutrition" onPress={() => handleShow('ingredient')}  />
                )}

                {recipes.length === 0 && (
                    <IconButton icon="fast-food" onPress={() => handleShow('category')}  />
                )}

                {recipes.length === 0 && (
                    <IconButton icon="time" onPress={() => handleShow('time')} />
                )}

                {recipes.length === 0 && (
                    <IconButton icon="bicycle" onPress={() => handleShow('calories')} />
                )}

                {recipes.length !== 0 && (
                    <IconButton icon="close" onPress={() => handleClearFilter()} color={'#DC2626'} />
                )}
            </View>

            {showTimePicker && (
                <View className="m-3">
                    <Text className="text-center text-lg font-bold text-slate-900">Filtrovat dle času</Text>
                    <Picker
                        selectedValue={time}
                        onValueChange={(timeValue) => setTime(timeValue)}
                        style={styles.picker}
                    >
                        {timeValues.map((timeValue, key) => (
                            <Picker.Item key={key} label={timeValue.label} value={timeValue.value} />
                        ))}
                    </Picker>

                    {time > 0 && (
                        <View className="flex flex-row justify-evenly mb-5">
                            <IconButton icon="close-sharp" onPress={() => handleCancel('time')} color="#EF4444" />
                            <IconButton icon="checkmark-sharp" onPress={() => handleConfirm('time')} color="#0D9488" />
                        </View>
                    )}
                </View>
            )}

            {showIngredientPicker && (
                <View className="m-3">
                    <Text className="text-center text-lg font-bold text-slate-900">Filtrovat dle ingredience</Text>
                    <Picker
                        selectedValue={selectedIngredient}
                        onValueChange={(ingredientValue) => setSelectedIngredient(ingredientValue)}
                        style={styles.picker}
                    >
                        {ingredientValues.map((ingredientValue, key) => (
                            <Picker.Item key={key} label={ingredientValue.label} value={ingredientValue.value} />
                        ))}
                    </Picker>

                    {selectedIngredient !== '' && (
                        <View className="flex flex-row justify-evenly mb-5 text-slate-900">
                            <IconButton icon="close-sharp" onPress={() => handleCancel('ingredient')} color="#EF4444" />
                            <IconButton icon="checkmark-sharp" onPress={() => handleConfirm('ingredient')} color="#0D9488" />
                        </View>
                    )}
                </View>
            )}
            {showCaloriesPicker && (
                <View className="m-3">
                    <Text className="text-center text-lg font-bold text-slate-900">Filtrovat dle kalorií</Text>
                    <Picker
                        selectedValue={selectedCalories}
                        onValueChange={(calorieValue) => setSelectedCalories(calorieValue)}
                        style={styles.picker}
                    >
                        {caloriesValues.map((calorieValue, key) => (
                            <Picker.Item key={key} label={calorieValue.label} value={calorieValue.value} />
                        ))}
                    </Picker>

                    {selectedCalories > 0 && (
                        <View className="flex flex-row justify-evenly mb-5">
                            <IconButton icon="close-sharp" onPress={() => handleCancel('calories')} color="#EF4444" />
                            <IconButton icon="checkmark-sharp" onPress={() => handleConfirm('calories')} color="#0D9488" />
                        </View>
                    )}
                </View>
            )}

            {showCategoryPicker && (
                <View className="m-3">
                    <Text className="text-center text-lg font-bold text-slate-900">Filtrovat dle kategorie</Text>
                    <Picker
                        selectedValue={selectedCategory}
                        onValueChange={(categoryValue) => setSelectedCategory(categoryValue)}
                        style={styles.picker}
                    >
                        {categoryValues.map((categoryValue, key) => (
                            <Picker.Item key={key} label={categoryValue.label} value={categoryValue.value} />
                        ))}
                    </Picker>

                    {selectedCategory !== '' && (
                        <View className="flex flex-row justify-evenly mb-5">
                            <IconButton icon="close-sharp" onPress={() => handleCancel('category')} color="#EF4444" />
                            <IconButton icon="checkmark-sharp" onPress={() => handleConfirm('category')} color="#0D9488" />
                        </View>
                    )}
                </View>
            )}
        </View>
    )
}