import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function MenuScreen() {
    const router = useRouter();

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
                    onPress={() => router.push('/game')}
                >
                    <Ionicons name="play-circle" size={24} color="white" />
                    <Text className="text-white text-lg font-medium ml-4 flex-1">
                        Nouveau jeu
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className="bg-gray-800 flex-row items-center p-5 rounded-xl mb-4 border border-blue-400"
                    onPress={() => router.push('/game')}
                >
                    <Ionicons name="play" size={24} color="white" />
                    <Text className="text-white text-lg font-medium ml-4 flex-1">
                        Continuer le jeu
                    </Text>
                </TouchableOpacity>

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
            </View>
        </View>
    );
}