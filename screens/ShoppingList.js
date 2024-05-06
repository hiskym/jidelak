import { View, Text, FlatList, Modal, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native'
import { useState, useEffect } from 'react';
import Checkbox from 'expo-checkbox';
import React from 'react';
import IconButton from '../components/IconButton';
import ShoppingListForm from './ShoppingListForm';
import { useCartStore } from '../store/CartStore';
import { handleCheckboxChange } from '../utils/checkboxUtils';
import { handleClearCart, loadCart, handleAddToCartItem, handleRemoveCartItem } from '../utils/CartUtils';
import SaveCart from '../components/SaveCart';
import { useUserStore } from '../store/UserStore';

export default function ShoppingList({ navigation }) {

    const { cart, setCart, clearCart, addToCartItem, removeFromCart } = useCartStore();

    const [modalOpen, setModalOpen] = useState(false);

    const { user } = useUserStore();

    const [checkedSteps, setCheckedSteps] = useState(new Array(cart.length).fill(false));

    useEffect(() => {
        loadCart(setCart);
    }, []);

    const handleAddToCart = (cartItem) => {
        handleAddToCartItem(cartItem, addToCartItem, setModalOpen);
    }

    const [showDetails, setShowDetails] = useState(false);

    return (
        <ScrollView className="flex flex-col flex-1 bg-white" nestedScrollEnabled={true}>
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
            <View className="items-center bg-teal-50 py-5 rounded-b-xl mb-2 shadow-sm">
                <View className="flex-row justify-center">
                    <IconButton icon={"add"} onPress={() => setModalOpen(true)} />
                    <IconButton icon={"trash"} onPress={() => handleClearCart(clearCart)} />
                    {user && (
                        <>
                            <IconButton icon={"heart"} onPress={() => setShowDetails(!showDetails)} color={showDetails === true && '#0D9488'} />
                            <IconButton icon={"calendar"} onPress={() => navigation.navigate('CartHistory')} />
                        </>
                    )}

                </View>
                {showDetails && <SaveCart setShowDetails={setShowDetails} />}

            </View>
            <View className="items-center">
                {cart.length === 0 ? (<Text className="text-center mt-2">Nákupní seznam je prázdný... Přidejte si něco 😉</Text>) : (
                    <FlatList
                        data={cart}
                        scrollEnabled={false}
                        renderItem={({ item, index }) => (
                            <View key={index} className={`flex flex-row justify-between items-center w-full px-5 py-1 m-1 ${index % 2 !== 0 && 'bg-gray-100 shadow-sm'}` }>
                                <View className="flex flex-row items-center">
                                    <Checkbox value={checkedSteps[index]} onValueChange={() => handleCheckboxChange(index, checkedSteps, setCheckedSteps)} className="m-2" />
                                    <Text className={`flex flex-shrink text-base ${checkedSteps[index] ? 'text-slate-400' : 'text-slate-900'}`}>{item.amount} {item.unit} {item.title}</Text>
                                </View>
                                <IconButton icon={"trash"} onPress={() => handleRemoveCartItem(item, removeFromCart)} />
                            </View>
                        )}
                    />
                )}
            </View>

            <View className="h-5"></View>
        </ScrollView>
    )
}