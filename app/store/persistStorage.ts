import AsyncStorage from '@react-native-async-storage/async-storage';

export const persistStorage = {
    getItem: async (name: string): Promise<string | null> => {
        try {
            return await AsyncStorage.getItem(name);
        } catch (error) {
            console.error('Error getting item from AsyncStorage:', error);
            return null;
        }
    },
    setItem: async (name: string, value: string): Promise<void> => {
        try {
            await AsyncStorage.setItem(name, value);
        } catch (error) {
            console.error('Error setting item in AsyncStorage:', error);
        }
    },
    removeItem: async (name: string): Promise<void> => {
        try {
            await AsyncStorage.removeItem(name);
        } catch (error) {
            console.error('Error removing item from AsyncStorage:', error);
        }
    },
};