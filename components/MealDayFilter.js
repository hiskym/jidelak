import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import IconButton from './IconButton';

export default function MealDayFilter({ setShowDetails, selectedDay, setSelectedDay }) {

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const handleConfirm = () => {
        if (selectedDay === '') {
            Alert.alert('Chyba!', 'Musíte vybrat den', [
                { text: 'OK' }
            ])
        } else {
            console.log(selectedDay)
            setShowDetails(false)
        }
    }

    const handleCancel = () => {
        setSelectedDay('');
        setShowDetails(false)
    }

    return (
        <View className="flex flex-1 gap-2 border rounded-lg w-[90%] items-center m-2 bg-white py-2">
            <Text className="text-lg font-bold text-slate-900">Zvolte si den 👀</Text>
            <View className="flex flex-row justify-evenly">
                <TouchableOpacity onPress={() => setDatePickerVisibility(true)}>
                    <Text className="font-bold text-blue-500 text-lg">{selectedDay !== '' ? selectedDay.toLocaleDateString('cs-CZ') : 'Vyberte datum'}</Text>
                </TouchableOpacity>
            </View>

            {isDatePickerVisible && (
                <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date"
                    onConfirm={(date) => { setSelectedDay(date); setDatePickerVisibility(false); setShowDetails(false) }}
                    onCancel={() => setDatePickerVisibility(false)}
                />
            )}
            <View className="flex flex-row justify-evenly">
                <IconButton icon="close-sharp" onPress={() => handleCancel()} color="#EF4444" />
                <IconButton icon="checkmark-sharp" onPress={() => handleConfirm()} color="#0D9488" />
            </View>
        </View>
    )
}