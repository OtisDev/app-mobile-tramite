import { AppConfig } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AppStore {
    settings: AppConfig,
    loading: boolean;
    setSettings: (settings: AppConfig) => void;
    setLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppStore>()(
    persist(
        (set) => ({
            settings: {
                external_links: [],
                citizen_security: {
                    phone_numbers: [],
                    others_phone_numbers: [],
                    email: undefined
                }
            },
            loading: false,
            setSettings: (settings: AppConfig) => set({ settings }),
            setLoading: (loading: boolean) => set({ loading }),
        }),
        {
            name: 'app-storage',

            storage: createJSONStorage(
                () => AsyncStorage
            ),
        }
    )
);