import { create } from 'zustand'

export const useCartStore = create((set) => ({
    cart: [],
    setCart: (newCart) => set({ cart: newCart }),
    addToCartItem: (cartItem) => set((state) => {
        const updatedCart = [...state.cart];
        const existingIndex = updatedCart.findIndex((item) =>
            item.title === cartItem.title && item.unit === cartItem.unit
        );

        if (existingIndex !== -1) {
            updatedCart[existingIndex].amount += cartItem.amount;
        } else {
            updatedCart.push(cartItem);
        }
        return { cart: updatedCart };
    }),
    addToCartRecipe: (ingredients) => set((state) => {
        const updatedCart = [...state.cart];
        ingredients.forEach((ingredient) => {
            const existingItem = updatedCart.findIndex((item) =>
                item.title === ingredient.title && item.unit === ingredient.unit
            );

            if (existingItem !== -1) {
                updatedCart[existingItem].amount += ingredient.amount;
            } else {
                updatedCart.push(ingredient);
            }
        });
        return { cart: updatedCart };
    }),
    removeFromCart: (cartItem) => set((state) => {
        const updatedCart = state.cart.filter((item) =>
            !(item.title === cartItem.title && item.unit === cartItem.unit)
        );
        return { cart: updatedCart };
    }),
    clearCart: () => set({ cart: [] })
}))