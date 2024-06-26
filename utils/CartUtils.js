import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { useCartStore } from "../store/CartStore";
import { cartsRef, recipeIngredientsRef, ingredientsRef } from '../firebaseConfig';
import { addDoc, getDocs, query, where, getDoc, doc, deleteDoc } from 'firebase/firestore';
import { getRecipeIngredients } from "./cacheUtils";

export const loadCart = async (setCart) => {
    try {
        const savedCart = await AsyncStorage.getItem('shoppingList');
        if (savedCart !== null) {
            setCart(JSON.parse(savedCart));
        }
    } catch (error) {
        console.error('Error loading cart:', error);
    }
}

export const handleAddToCartRecipe = async (ingredients, addToCartRecipe) => {
    try {
        await addToCartRecipe(ingredients);
        const updatedCart = useCartStore.getState().cart;
        await AsyncStorage.setItem('shoppingList', JSON.stringify(updatedCart));

        Alert.alert('Úspěch!', 'Úspešně přidáno', [
            { text: 'OK' }
        ])
    } catch (error) {
        console.error('Error adding to cart:', error);
    }
};

export const handleAddToCartItem = async (cartItem, addToCartItem, setModalOpen) => {
    try {
        await addToCartItem(cartItem);
        const updatedCart = useCartStore.getState().cart
        await AsyncStorage.setItem('shoppingList', JSON.stringify(updatedCart));
        setModalOpen(false);

    } catch (error) {
        console.error('Error adding to cart:', error);
    }
};

export const handleRemoveCartItem = async (cartItem, removeFromCart) => {
    try {
        await removeFromCart(cartItem)
        const updatedCart = useCartStore.getState().cart
        await AsyncStorage.setItem('shoppingList', JSON.stringify(updatedCart));
    } catch (error) {
        console.error(error);
    }
};

export const handleClearCart = (clearCart) => {
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
                    clearCart();
                }

            },
        ])
    } catch (error) {
        console.error('Error clearing cart:', error);
    }
}

export const saveCart = async (userId, title, plannedBuy, date) => {
    try {

        const content = useCartStore.getState().cart;

        if (content.length === 0) {
            Alert.alert('Nákupní seznam je prázdný', 'Musíte nejdříve přidat položky do seznamu.', [
                {
                    text: 'OK',
                }
            ])
        } else if (title === '') {
            Alert.alert('Chyba!', 'Musíte zvolit název', [
                { text: 'OK' }
            ])
        } else if (plannedBuy === '') {
            Alert.alert('Chyba!', 'Musíte vybrat den nákupu', [
                { text: 'OK' }
            ])
        } else {
            const cartObj = { userId, title, content, date, plannedBuy }

            await addDoc(cartsRef, cartObj);

            // console.log(cartObj)

            Alert.alert('Úspěch!', 'Úspešně přidáno', [
                { text: 'OK' }
            ])
        }
    } catch (error) {
        console.log(error)
    }
}

export const fetchAllCarts = async (userId, setCartsData, setLoading) => {
    setLoading(true);
    try {
        const cartsSnapshot = await getDocs(query(cartsRef, where("userId", "==", userId)))

        if (!cartsSnapshot.empty) {
            const cartsData = cartsSnapshot.docs.map(doc => ({
                id: doc.id,
                data: {
                    title: doc.data().title,
                    plannedBuy: doc.data().plannedBuy
                }
            }));
            // console.log(cartsData)
            setCartsData(cartsData);
        } else {
            console.log('no carts found')
            setCartsData([])
        }
        setLoading(false);
    } catch (error) {
        console.error(error);
    }
}

export const fetchCartData = async (cartId, setCartData, setCheckedSteps) => {
    try {
        const cartDoc = doc(cartsRef, cartId)
        const cartSnapshot = await getDoc(cartDoc);

        if (cartSnapshot.exists()) {
            const { content, date, plannedBuy } = cartSnapshot.data();
            const cartData = { content, date, plannedBuy }
            setCartData(cartData);
            setCheckedSteps(new Array(cartData.content.length).fill(false))
        } else {
            console.log(`error: ${cartId} deosnt exist`)
        }
    } catch (error) {
        console.error(error)
    }
}

export const removeFromCarts = async (cartId) => {
    try {
        const cartDoc = doc(cartsRef, cartId)

        await deleteDoc(cartDoc);

    } catch (error) {
        console.error(error)
    }
}

export const addToCartFullWeek = async (addToCartRecipe, meals, setLoading) => {
    setLoading(true)
    try {
        if (meals.length === 0) {
            Alert.alert('Chyba!', 'Nelze vytvořit nákupní seznam. Doplňte nějaké potraviny.', [
                { text: 'OK' }
            ])
            setLoading(false);
            return;
        }

        const recipeIds = meals.map(meal => meal.recipeId);

        const ingredientsData = [];

        for (const recipeId of recipeIds) {
            const cachedIngredients = await getRecipeIngredients(recipeId)

            if (cachedIngredients) {
                // console.log(cachedIngredients)
                for (const ingredient of cachedIngredients) {
                    ingredientsData.push(ingredient);
                }
            } else {
                const recipeIngredientsQuery = query(recipeIngredientsRef, where('recipeId', '==', recipeId));
                const recipeIngredientsSnapshot = await getDocs(recipeIngredientsQuery);

                for (const docRef of recipeIngredientsSnapshot.docs) {
                    const { ingredientId, amount } = docRef.data();

                    const ingredientDoc = await getDoc(doc(ingredientsRef, ingredientId));

                    if (ingredientDoc.exists()) {
                        const { title, unit } = ingredientDoc.data();

                        const ingredientData = { title, unit, amount };

                        ingredientsData.push(ingredientData);

                    } else {
                        console.error(`${ingredientId} not found.`);
                    }
                }
            }
        }
        // console.log(ingredientsData);
        if (ingredientsData.length !== 0) {
            addToCartRecipe(ingredientsData);
            const updatedCart = useCartStore.getState().cart;
            await AsyncStorage.setItem('shoppingList', JSON.stringify(updatedCart));

            Alert.alert('Úspěch!', 'Úspešně přidáno.', [
                { text: 'OK' }
            ])
        }
    } catch (error) {
        console.error(error)
    }
    setLoading(false)
}