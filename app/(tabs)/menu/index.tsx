import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useGameStore } from '../../store/useSettingsStore';

export default function MenuScreen() {
    const router = useRouter();
    const { savedGrid, savedGameOver, clearGameState, isLoading, savedGameId } = useGameStore();
    const [hasSavedGame, setHasSavedGame] = useState(false);

    useEffect(() => {
        setHasSavedGame(!!savedGameId && !!savedGrid && !savedGameOver);
    }, [savedGrid, savedGameOver, savedGameId]);

    const handleNewGame = () => {
        clearGameState();
        router.push('/game');
    };

    const handleContinueGame = () => {
        router.push('/game');
    };

    if (isLoading) {
        return (
            <View className="flex-1 bg-gray-900 justify-center items-center">
                <ActivityIndicator size="large" color="#1bb5fc" />
                <Text className="text-blue-400 mt-4">Chargement...</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-gray-900 justify-between items-center py-12 px-5">
            <View className="items-center mt-10">
                <Ionicons name="grid" size={80} color="#1bb5fc" className="mb-5" />
                <Text className="text-5xl font-bold text-blue-400 mb-2.5 text-center">
                    DÉMINEUR
                </Text>
                <Text className="text-lg text-gray-400 text-center">
                    Le jeu classique de stratégie
                </Text>
            </View>

            <View className="w-full max-w-md">
                <TouchableOpacity
                    className="bg-gray-800 flex-row items-center p-5 rounded-xl mb-4 border border-blue-400"
                    onPress={handleNewGame}
                >
                    <Ionicons name="play-circle" size={24} color="white" />
                    <Text className="text-white text-lg font-medium ml-4 flex-1">
                        Nouveau jeu
                    </Text>
                </TouchableOpacity>

                {hasSavedGame && (
                    <TouchableOpacity
                        className="bg-gray-800 flex-row items-center p-5 rounded-xl mb-4 border border-green-400"
                        onPress={handleContinueGame}
                    >
                        <Ionicons name="play" size={24} color="white" />
                        <Text className="text-white text-lg font-medium ml-4 flex-1">
                            Continuer le jeu
                        </Text>
                        <View className="flex-row items-center">
                            <Ionicons name="download" size={20} color="#00B300" />
                            <Text className="text-green-400 text-xs ml-1">ID: {savedGameId}</Text>
                        </View>
                    </TouchableOpacity>
                )}

                <TouchableOpacity
                    className="bg-gray-800 flex-row items-center p-5 rounded-xl mb-4 border border-blue-400"
                    onPress={() => router.push('/options')}
                >
                    <Ionicons name="settings" size={24} color="white" />
                    <Text className="text-white text-lg font-medium ml-4 flex-1">
                        Options
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className="bg-gray-800 flex-row items-center p-5 rounded-xl mb-4 border border-blue-400"
                    onPress={() => router.push('/help')}
                >
                    <Ionicons name="help-circle" size={24} color="white" />
                    <Text className="text-white text-lg font-medium ml-4 flex-1">
                        Aide
                    </Text>
                </TouchableOpacity>
            </View>

            <View className="items-center">
                <Text className="text-gray-400 text-sm">
                    © {new Date().getFullYear()} Mineswipper - RaJharit77
                </Text>
                {savedGameId && (
                    <Text className="text-gray-600 text-xs mt-1">
                        Game ID: {savedGameId}
                    </Text>
                )}
            </View>
        </View>
    );
}