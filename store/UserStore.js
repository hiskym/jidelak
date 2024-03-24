import { create } from 'zustand'

export const useUserStore = create((set) => ({
    user: null,
    setUser: (newUser) => set({ user: newUser })
}))