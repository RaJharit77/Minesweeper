import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useGameStore } from '../store/useSettingsStore';

export const SqliteStatus = () => {
    const { sqliteError } = useGameStore();

    if (!sqliteError) {
        return null;
    }

    return (
        <View className="absolute bottom-20 left-0 right-0 items-center">
            <View className="bg-yellow-500/20 border border-yellow-500 rounded-lg p-3 flex-row items-center">
                <Ionicons name="warning" size={20} color="#f59e0b" />
                <Text className="text-yellow-500 ml-2 text-sm">
                    SQLite désactivé - Utilisation du stockage local
                </Text>
            </View>
        </View>
    );
};