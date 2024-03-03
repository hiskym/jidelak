import { View, Text, TouchableOpacity, TextInput, Alert } from 'react-native'
import React from 'react'
import { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { addToMenu } from '../utils/menuUtils';

export default function MenuAddDetails({ setShowDetails, userId, recipeId }) {

    const [showPicker, setShowPicker] = useState(false);
    const [note, setNote] = useState('');
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [selectedDay, setSelectedDay] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [showNote, setShowNote] = useState(false);

    const type = [
        {
            'label': 'Vyberte typ',
            'value': ''
        },
        {
            'label': 'Snídaně',
            'value': 'breakfast'
        },
        {
            'label': 'Oběd',
            'value': 'lunch'
        },
        {
            'label': 'Večeře',
            'value': 'dinner'
        },
        {
            'label': 'Svačinka',
            'value': 'snack'
        },
    ]

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

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirmDate = (date) => {
        hideDatePicker();
        setSelectedDay(date);
    };

    const handleShowPicker = () => {
        setShowPicker(true);
    }

    const handleConfirmType = () => {
        console.log('Selected option:', selectedType);
        setShowPicker(false);
        // setSelectedType(selectedType);
    }

    const handleShowNote = () => {
        setShowNote(true);
    }

    const handleConfirmNote = () => {
        setShowNote(false);
    }

    const showTypeName = () => {
        const selectedTypeObj = type.find(item => item.value === selectedType);
        return selectedTypeObj ? selectedTypeObj.label : null;
    }

    return (
        <View className="flex flex-1 gap-2 border rounded-lg w-[400] items-center m-2">
            <Text className="text-lg font-bold">Kdy si chcete jídlo dát? 👀</Text>
            <View className="flex flex-row justify-evenly">
                <TouchableOpacity onPress={showDatePicker}>
                    <Text className="font-bold text-blue-500 text-lg">{selectedDay !== '' ? selectedDay.toLocaleDateString('cs-CZ') : 'Vyberte datum'}</Text>
                </TouchableOpacity>
            </View>

            {isDatePickerVisible && (
                <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date"
                    onConfirm={handleConfirmDate}
                    onCancel={hideDatePicker}
                />
            )}
            <View className="flex flex-row justify-evenly">
                <TouchableOpacity onPress={handleShowPicker}>
                    <Text className="font-bold text-blue-500 text-lg"> {selectedType !== '' ? `Typ: ${showTypeName()}` : 'Vyberte typ'}</Text>
                </TouchableOpacity>
            </View>
            {showPicker && (
                <>

                    <Picker
                        style={{ width: '70%', height: '20%', flex: 1, marginTop: -80 }}
                        selectedValue={selectedType}
                        onValueChange={(itemValue, itemIndex) =>
                            setSelectedType(itemValue)
                        }>
                        {type.map((type, key) => (
                            <Picker.Item key={key} label={type.label} value={type.value} />
                        ))}
                    </Picker>
                    <TouchableOpacity onPress={handleConfirmType}>
                        <Text className="font-bold text-red-500 text-lg flex">Potvrdit</Text>
                    </TouchableOpacity>
                </>
            )}
            <View className="flex flex-row justify-evenly">
                <TouchableOpacity onPress={handleShowNote}>
                    <Text className="font-bold text-blue-500 text-lg"> {note !== '' ? `Poznámka: ${note}` : 'Přidejte poznámku'}</Text>
                </TouchableOpacity>
            </View>
            {showNote && (
                <View>
                    <TextInput
                        onChangeText={setNote}
                        value={note}
                        placeholder='Např. snídaně'
                    />
                    <TouchableOpacity onPress={handleConfirmNote}>
                        <Text className="font-bold text-red-500 text-lg flex">Potvrdit</Text>
                    </TouchableOpacity>
                </View>
            )}

            <View className="flex flex-row justify-between">
                <TouchableOpacity onPress={handleDetailsCancel}>
                    <Text className="font-bold text-red-500 text-lg mx-10">Zrušit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleDetailsConfirm}>
                    <Text className="font-bold text-blue-500 text-lg mx-10">Potvrdit</Text>
                </TouchableOpacity>
            </View>

        </View>
    )
}