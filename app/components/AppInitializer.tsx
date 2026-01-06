import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { useGameStore } from '../store/useSettingsStore';

const AppInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { loadSavedGame, isLoading } = useGameStore();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadGame = async () => {
            try {
                await loadSavedGame();
            } catch (error) {
                console.error('Error loading saved game:', error);
                setError('Impossible de charger la partie sauvegardée');
            }
        };

        loadGame();
    }, []);

    if (isLoading) {
        return (
            <View className="flex-1 bg-gray-900 justify-center items-center">
                <ActivityIndicator size="large" color="#1bb5fc" />
                <Text className="text-blue-400 mt-4">Chargement de la partie...</Text>
                {error && (
                    <Text className="text-red-400 mt-2">{error}</Text>
                )}
            </View>
        );
    }

    return <>{children}</>;
};

export default AppInitializer;