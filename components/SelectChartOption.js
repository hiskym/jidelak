import { View, Text, Alert, TouchableOpacity } from 'react-native'
import { useState } from 'react'
import React from 'react'
import { Picker } from '@react-native-picker/picker'
import { intervalValues } from '../utils/PickerValues'
import { styles } from '../styles/GlobalStyles'
import IconButton from './IconButton'

export default function SelectChartOption({ setInterval, interval }) {

    const [showPicker, setShowPicker] = useState(false);

    const [selectedInterval, setSelectedInterval] = useState('');

    const handleConfirm = () => {
        if (selectedInterval === '') {
            Alert.alert('Chyba!', 'Musíte vybrat období!', [
                { text: 'OK' }
            ])
        } else {
            setInterval(selectedInterval)
            setShowPicker(false)
        }
    }

    const handleCancel = () => {
        setShowPicker(false)
    }

    const showIntervalName = () => {
        const selectedIntervalObj = intervalValues.find(intervalValue => intervalValue.value === interval);
        return selectedIntervalObj ? selectedIntervalObj.label : null;
    }

    return (
        <View>
            {interval === '' && <Text className="text-xl text-center m-2">Pro jaké období chcete zobrazit statistiky?</Text>}
            <View className="flex flex-row justify-evenly m-2">
                <TouchableOpacity onPress={() => setShowPicker(true)}>
                    <Text className="font-bold text-blue-500 text-xl"> {interval !== '' ? `Období: ${showIntervalName()}` : 'Vyberte období'}</Text>
                </TouchableOpacity>
            </View>
            {showPicker && (
                <>
                    <Picker
                        selectedValue={selectedInterval}
                        onValueChange={intervalValue => setSelectedInterval(intervalValue)}
                        style={styles.picker}
                    >
                        {intervalValues.map((intervalValue, key) => (
                            <Picker.Item key={key} label={intervalValue.label} value={intervalValue.value} />
                        ))}
                    </Picker>

                    {selectedInterval && (
                        <View className="flex flex-row justify-evenly mb-5">
                            <IconButton icon="close-sharp" onPress={() => handleCancel()} color="#EF4444" />
                            <IconButton icon="checkmark-sharp" onPress={() => handleConfirm()} color="#0D9488" />
                        </View>
                    )}
                </>
            )}

        </View>
    )
}
