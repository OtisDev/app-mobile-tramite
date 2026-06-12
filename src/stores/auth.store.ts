import { User } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface AuthStore {
    signedIn: boolean;
    token: string | null;
    user: User | null;

    setToken: (token: string) => void;
    setUser: (user: User) => void;

    logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            signedIn: false,
            token: null,
            user: null,

            setToken: (token: string) => set({ token }),

            setUser: (user: User) => set({ user }),

            setSignedIn: (signedIn: boolean) => set({ signedIn }),

            logout: () => set({
                token: null,
                user: null,
                signedIn: false,
            }),
        }),
        {
            name: 'auth-storage',

            storage: createJSONStorage(
                () => AsyncStorage
            ),
        }
    )
);