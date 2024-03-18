import { View, Text, TouchableOpacity, TextInput, Alert } from 'react-native'
import React from 'react'
import { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { addToMenu } from '../utils/menuUtils';
import { type } from '../utils/PickerValues';
import { styles } from '../styles/GlobalStyles';
import IconButton from './IconButton';

export default function MenuAddDetails({ setShowDetails, userId, recipeId }) {

    const [showPicker, setShowPicker] = useState(false);
    const [note, setNote] = useState('');
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [selectedDay, setSelectedDay] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [showNote, setShowNote] = useState(false);

    const handleDetailsConfirm = () => {

        // addToMenu(selectedDay);
        if (selectedDay === '') {
            Alert.alert('Chyba!', 'Musíte vybrat den', [
                { text: 'OK' }
            ])
        } else if (selectedType === '') {
            Alert.alert('Chyba!', 'Musíte vybrat typ jídla', [
                { text: 'OK' }
            ])
        } else {
            Alert.alert('Úspěch!', 'Úspešně přidáno', [
                { text: 'OK' }
            ])
            setShowDetails(false);
            addToMenu(recipeId, userId, selectedDay, selectedType, note);
        }


        console.log(selectedDay);
        console.log(selectedType);
        console.log(note)
    };

    const handleDetailsCancel = () => {
        console.log('Picking canceled');
        setShowDetails(false);
        setNote('');
        setSelectedDay('');
        setSelectedType('');
    }

    const handleConfirmDate = (date) => {
        setDatePickerVisibility(false);
        setSelectedDay(date);
    };

    const showTypeName = () => {
        const selectedTypeObj = type.find(item => item.value === selectedType);
        return selectedTypeObj ? selectedTypeObj.label : null;
    }

    return (
        <View className="flex border rounded-lg w-[90%] items-center justify-center p-2 m-2">
            <Text className="text-lg font-bold my-1 text-slate-900">Kdy si chcete jídlo dát? 👀</Text>
            <View className="flex flex-row justify-evenly my-1">
                <TouchableOpacity onPress={() => setDatePickerVisibility(true)}>
                    <Text className="font-bold text-blue-500 text-lg">{selectedDay !== '' ? selectedDay.toLocaleDateString('cs-CZ') : 'Vyberte datum'}</Text>
                </TouchableOpacity>
            </View>

            {isDatePickerVisible && (
                <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date"
                    onConfirm={handleConfirmDate}
                    onCancel={() => setDatePickerVisibility(false)}
                    textColor='black'
                />
            )}
            <View className="flex flex-row justify-evenly my-1">
                <TouchableOpacity onPress={() => setShowPicker(true)}>
                    <Text className="font-bold text-blue-500 text-lg"> {selectedType !== '' ? `Typ: ${showTypeName()}` : 'Vyberte typ'}</Text>
                </TouchableOpacity>
            </View>
            {showPicker && (
                <>
                    <Picker
                        style={styles.pickerAddMeal}
                        selectedValue={selectedType}
                        onValueChange={(itemValue, itemIndex) =>
                            setSelectedType(itemValue)
                        }>
                        {type.map((type, key) => (
                            <Picker.Item key={key} label={type.label} value={type.value} />
                        ))}
                    </Picker>
                    <IconButton icon="checkmark-sharp" onPress={() => setShowPicker(false)} color="#0D9488" />
                </>
            )}
            <View className="flex flex-row justify-evenly my-1">
                <TouchableOpacity onPress={() => setShowNote(true)}>
                    <Text className="font-bold text-blue-500 text-lg"> {note !== '' ? `Poznámka: ${note}` : 'Přidejte poznámku'}</Text>
                </TouchableOpacity>
            </View>
            {showNote && (
                <View className="items-center">
                    <TextInput
                        onChangeText={setNote}
                        value={note}
                        placeholder='Např. snídaně'
                    />
                    <IconButton icon="checkmark-sharp" onPress={() => setShowNote(false)} color="#0D9488" />
                </View>
            )}
            {selectedDay !== '' && selectedType !== '' && (
                <View className="flex flex-row justify-evenly my-1">
                    <IconButton icon="close-sharp" onPress={() => handleDetailsCancel()} color="#EF4444" />
                    <IconButton icon="checkmark-sharp" onPress={() => handleDetailsConfirm()} color="#0D9488" />
                </View>
            )}
        </View>
    )
}