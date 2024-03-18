import { View, Text, FlatList, Alert, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import Checkbox from 'expo-checkbox';
import IconButton from '../components/IconButton';
import { fetchCartData, removeFromCarts } from '../utils/CartUtils';
import { handleCheckboxChange } from '../utils/checkboxUtils';
import { formatDateCZ } from '../utils/DateUtils';

export default function CartDetail({route, navigation}) {

    const [cartData, setCartData] = useState([]);

    const [checkedSteps, setCheckedSteps] = useState([]);

    useEffect(() => {
        fetchCartData(route.params.id, setCartData, setCheckedSteps)
    }, [route.params.id])

    const handleRemoveCart = () => {
        Alert.alert('Smazání seznamu', 'Opravdu chcete odstranit nákupní seznam?', [
            { 
                text: 'Zrušit',
                onPress: () => console.log('Canceled')
            },
            { 
                text: 'OK',
                onPress: async () => {
                    await removeFromCarts(route.params.id)
                    navigation.goBack();
                }
            },
        ])
    }

    return (
        <ScrollView className="flex flex-col p-3" nestedScrollEnabled={true}>
            <Text className="text-3xl text-center font-semibold my-2 text-slate-900">{cartData.title}</Text>
            <Text className="text-xl text-center font-semibold mb-2 text-slate-900">{`Datum nákupu: ${formatDateCZ(cartData.plannedBuy)}`}</Text>
            <Text className="text-base text-center mb-2 text-slate-900">{`Datum vytvoření: ${formatDateCZ(cartData.date)}`}</Text>
            <View className="flex-row justify-center my-5">
                <IconButton icon={"trash"} onPress={() => handleRemoveCart()} />
            </View>
            <View className="border-[0.5px] border-slate-600 mb-2" />
            {/* <Button title="cart" onPress={() => {console.log(cartData.content)}} /> */}           
            <FlatList
                    data={cartData.content}
                    renderItem={({ item, index }) => (
                        <View className="flex flex-row items-center w-96 m-1">
                            <Checkbox value={checkedSteps[index]} onValueChange={() => handleCheckboxChange(index, checkedSteps, setCheckedSteps)} className="m-2" />
                            <Text className="flex flex-shrink text-slate-900">{item.amount} {item.unit} {item.title}</Text>
                        </View>
                    )}
                    className="h-full"
                    scrollEnabled={false}
                />
            <View className="h-5"></View>
        </ScrollView>
    )
}