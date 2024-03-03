import { View, Text, FlatList, Modal, TouchableWithoutFeedback, Keyboard, Alert, Button } from 'react-native'
import { useState, useEffect } from 'react';
import Checkbox from 'expo-checkbox';
import React from 'react';
import IconButton from '../components/IconButton';
import ShoppingListForm from './ShoppingListForm';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCartStore } from '../store/CartStore';
import { handleCheckboxChange } from '../utils/checkboxUtils';
import { handleClearCart, loadCart, handleAddToCartItem, handleRemoveCartItem } from '../utils/CartUtils';
import SaveCart from '../components/SaveCart';

export default function ShoppingList({navigation}) {

    const { cart, setCart, clearCart, addToCartItem, removeFromCart } = useCartStore();

    // const [cart, setCart] = useState([{ "amount": 250, "title": "studená voda", "unit": "ml" }, { "amount": 1, "title": "sůl", "unit": "lžička" }]);

    const [modalOpen, setModalOpen] = useState(false);

    const [checkedSteps, setCheckedSteps] = useState(new Array(cart.length).fill(false));

    useEffect(() => {
        loadCart(setCart);
    }, []);

    const handleAddToCart = (cartItem) => {
        handleAddToCartItem(cartItem, addToCartItem, setModalOpen);
    }

    const [showDetails, setShowDetails] = useState(false);

    return (
        <View className="flex flex-col flex-1 m-2">

            <Modal visible={modalOpen} animationType="slide" className="bg-slate-100">
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View className="flex-col flex-1 justify-between m-5 mt-20 items-center">
                        <IconButton
                            icon='close'
                            onPress={() => setModalOpen(false)}
                        />
                        <ShoppingListForm addToCart={handleAddToCart} />
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            <View className="flex-row justify-center my-5">
                <IconButton icon={"add"} onPress={() => setModalOpen(true)} />
                <IconButton icon={"trash"} onPress={() => handleClearCart(clearCart)} />
                <IconButton icon={"heart"} onPress={() => setShowDetails(true)} />
                <IconButton icon={"calendar"} onPress={() => navigation.navigate('CartHistory')} />
            </View>
            {showDetails && <SaveCart setShowDetails={setShowDetails} />}
            
            <Button title='console cart' onPress={() => console.log(cart)} />
            {cart.length === 0 ? (<Text className="text-center">Nákupní seznam je prázdný...</Text>) : (
                <FlatList
                    data={cart}
                    renderItem={({ item, index }) => (
                        <View className="flex flex-row items-center w-96 m-1">
                            <Checkbox value={checkedSteps[index]} onValueChange={() => handleCheckboxChange(index, checkedSteps, setCheckedSteps)} className="m-2" />
                            <Text className="flex flex-shrink">{item.amount} {item.unit} {item.title}</Text>
                            <IconButton icon={"trash"} onPress={() => handleRemoveCartItem(item, removeFromCart)} />
                        </View>
                    )}
                />
            )}


        </View>
    )
}