import { View, Text, FlatList, Modal, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native'
import { useState, useEffect } from 'react';
import Checkbox from 'expo-checkbox';
import React from 'react';
import IconButton from '../components/IconButton';
import ShoppingListForm from './ShoppingListForm';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ShoppingList({cart, setCart}) {

    // const [cart, setCart] = useState([{ "amount": 250, "title": "studená voda", "unit": "ml" }, { "amount": 1, "title": "sůl", "unit": "lžička" }]);

    const [modalOpen, setModalOpen] = useState(false);

    const [checkedSteps, setCheckedSteps] = useState(new Array(cart.length).fill(false));

    useEffect(() => {
        async function loadCart() {
            try {
                const savedCart = await AsyncStorage.getItem('shoppingList');
                if (savedCart !== null) {
                    setCart(JSON.parse(savedCart));
                }
            } catch (error) {
                console.error('Error loading cart:', error);
            }
        }

        loadCart();
    }, []);

    const handleCheckboxChange = (index) => {
        const updatedCheckedSteps = [...checkedSteps];
        updatedCheckedSteps[index] = !updatedCheckedSteps[index];
        setCheckedSteps(updatedCheckedSteps);
    };

    const addToCart = async (cartItem) => {
        try {
            const updatedCart = [...cart];

        const existingIndex = updatedCart.findIndex((item) => 
            item.title === cartItem.title && item.unit === cartItem.unit
        );

        if (existingIndex !== -1) {
            updatedCart[existingIndex].amount += cartItem.amount;
        } else {
            updatedCart.push(cartItem);
        }
            await AsyncStorage.setItem('shoppingList', JSON.stringify(updatedCart));
            setCart(updatedCart);
            setModalOpen(false);
            
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    
// pruízpusobit metody pro async storage
    const clearCart = () => {
        try {
        Alert.alert('Smazat seznam', 'Opravdu chcete smazat nákupní seznam?', [
            {
                text: 'Zrušit',
                onPress: () => console.log('Cancel Pressed'),
            },
            { 
                text: 'OK', 
                onPress: async () => {
                    await AsyncStorage.removeItem('shoppingList');
                    setCart([])
                }
                
            },
        ])
    } catch (error) {
        console.error('Error clearing cart:', error);
    }
    }

    return (
        <View className="flex flex-col flex-1 m-2">

            <Modal visible={modalOpen} animationType="slide" className="bg-slate-100">
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View className="flex-col flex-1 justify-between m-5 mt-20 items-center">
                        <IconButton
                            icon='close'
                            onPress={() => setModalOpen(false)}
                        />
                        <ShoppingListForm addToCart={addToCart} />
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            <View className="flex-row justify-center my-5">
                <IconButton icon={"add"} onPress={() => setModalOpen(true)} />
                <IconButton icon={"trash"} onPress={() => clearCart()} />
            </View>

            {cart.length === 0 ? (<Text className="text-center">Nákupní seznam je prázdný...</Text>) : (
                <FlatList
                    data={cart}
                    renderItem={({ item, index }) => (
                        <View className="flex flex-row items-center w-96 m-1">
                            <Checkbox value={checkedSteps[index]} onValueChange={() => handleCheckboxChange(index)} className="m-2" />
                            <Text className="flex flex-shrink">{item.amount} {item.unit} {item.title}</Text>
                        </View>
                    )}
                />
            )}


        </View>
    )
}