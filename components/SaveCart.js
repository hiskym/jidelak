import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useUserStore } from '../store/UserStore';
import { saveCart } from '../utils/CartUtils';
import IconButton from './IconButton';

export default function SaveCart({ setShowDetails }) {

    const [title, setTitle] = useState('');
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [selectedDay, setSelectedDay] = useState('');

    const handleConfirmDate = (date) => {
        setDatePickerVisibility(false)
        setSelectedDay(date);
    };

    const { user } = useUserStore();


    const handleDetailsConfirm = () => {
        setShowDetails(false);
        saveCart(user.uid, title, selectedDay, currentDate);
    };

    const handleDetailsCancel = () => {
        console.log('Picking canceled');
        setShowDetails(false);
        setSelectedDay('');
    }

    const currentDate = new Date();

    return (
        <View className="flex border rounded-lg w-[90%] items-center justify-center p-2 mt-4 h-[200px] bg-white shadow-md">
            <Text className="text-lg font-bold my-1 text-slate-900">Uložte si nákupní seznam</Text>
            <TextInput
                onChangeText={setTitle}
                value={title}
                placeholder='Název'
                autoCapitalize='none'
                className="border border-stone-500 rounded-lg w-[90%] h-[25%] my-1 pl-3"
            />
            <View className="flex flex-row justify-evenly my-1">
                <TouchableOpacity onPress={() => setDatePickerVisibility(true)}>
                    <Text className="font-bold text-blue-500 text-lg">{selectedDay !== '' ? (`Datum nákupu: ${selectedDay.toLocaleDateString('cs-CZ')}`) : 'Vyberte datum plánovaného nákupu'}</Text>
                </TouchableOpacity>
            </View>
            {isDatePickerVisible && (
                <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date"
                    onConfirm={handleConfirmDate}
                    onCancel={() => setDatePickerVisibility(false)}
                />
            )}
            <View className="flex flex-row justify-between my-1">
                <IconButton icon="close-sharp" onPress={() => handleDetailsCancel()} color="#EF4444" />
                <IconButton icon="checkmark-sharp" onPress={() => handleDetailsConfirm()} color="#0D9488" />
            </View>
        </View>
    )
}