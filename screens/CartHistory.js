import { ScrollView, Text, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useUserStore } from '../store/UserStore'
import { fetchAllCarts } from '../utils/CartUtils'
import CartItems from '../components/CartItems'

export default function CartHistory({ navigation }) {

    const { user } = useUserStore();

    const [loading, setLoading] = useState(false);

    const [cartsData, setCartsData] = useState([]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            fetchAllCarts(user.uid, setCartsData, setLoading);
        });

        return unsubscribe;
    }, [navigation]);

    return (
        <ScrollView className="">
            {loading && <ActivityIndicator size="small" color="tomato" className="flex-1 justify-center rounded-sm scale-150" />}
            {cartsData.length === 0 ? (
                <Text className="text-center mt-12 text-xl text-slate-900">Nemáte uložený žádný nákupní seznam. Přidejte si nějaký!</Text>
            ) : (
                <CartItems carts={cartsData} navigation={navigation} />
            )}

        </ScrollView>
    )
}