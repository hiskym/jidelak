import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useCartStore } from '../store/CartStore';
import { useUserStore } from '../store/UserStore';
import { cartsRef } from '../firebaseConfig';
import { addDoc } from 'firebase/firestore';
import { saveCart } from '../utils/CartUtils';

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
        <View className="flex flex-col gap-2 border rounded-lg w-[400] items-center m-2 bg-slate-100 h-48">
            <Text className="text-lg font-bold">Uložte si nákupní seznam</Text>
            <TextInput
                onChangeText={setTitle}
                value={title}
                placeholder='Název'
                autoCapitalize='none'
                className="border border-stone-500 p-2.5 text-lg rounded-lg w-[90%] h-[25%]"
            />
            <View className="flex flex-row justify-evenly">
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