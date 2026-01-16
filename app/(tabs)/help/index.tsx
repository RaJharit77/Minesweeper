import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function HelpScreen() {
    const router = useRouter();

    return (
        <View className="flex-1 bg-gray-900 pt-12">
            <TouchableOpacity
                className="flex-row items-center p-4 pl-5"
                onPress={() => router.back()}
            >
                <Ionicons name="arrow-back" size={24} color="#1bb5fc" />
                <Text className="text-blue-400 text-base ml-2.5 font-medium">Retour</Text>
            </TouchableOpacity>

            <ScrollView contentContainerClassName="p-5 pb-10">
                <Text className="text-3xl font-bold text-blue-400 mb-7 text-center">
                    Aide - Règles du Démineur
                </Text>

                <View className="bg-gray-800 rounded-xl p-5 mb-5">
                    <Text className="text-blue-400 text-xl font-bold mb-4">Objectif du jeu</Text>
                    <Text className="text-gray-200 text-base leading-relaxed">
                        Le but du jeu est de découvrir toutes les cases qui ne contiennent pas de mines,
                        sans faire exploser aucune bombe.
                    </Text>
                </View>

                <View className="bg-gray-800 rounded-xl p-5 mb-5">
                    <Text className="text-blue-400 text-xl font-bold mb-4">Comment jouer</Text>

                    <View className="flex-row items-center mb-3">
                        <Ionicons name="square-outline" size={20} color="#1bb5fc" />
                        <Text className="text-gray-200 text-base ml-2.5 flex-1">
                            Cliquez sur une case pour la révéler.
                        </Text>
                    </View>

                    <View className="flex-row items-center mb-3">
                        <Text className="text-xl mr-2.5">1</Text>
                        <Text className="text-gray-200 text-base flex-1">
                            Les nombres indiquent combien de bombes se trouvent dans les cases adjacentes.
                        </Text>
                    </View>

                    <View className="flex-row items-center mb-3">
                        <Ionicons name="alert-circle" size={20} color="#FF3B3B" />
                        <Text className="text-gray-200 text-base ml-2.5 flex-1">
                            Si vous cliquez sur une bombe, la partie est perdue.
                        </Text>
                    </View>

                    <View className="flex-row items-center">
                        <Ionicons name="flag" size={20} color="#00B300" />
                        <Text className="text-gray-200 text-base ml-2.5 flex-1">
                            Pour marquer une case suspectée d'être une bombe, maintenez appuyé.
                        </Text>
                    </View>
                </View>

                <View className="bg-gray-800 rounded-xl p-5 mb-5">
                    <Text className="text-blue-400 text-xl font-bold mb-4">🎮 Niveaux de difficulté</Text>

                    <View className="bg-gray-700 rounded-lg p-4 mb-2.5">
                        <Text className="text-blue-400 text-lg font-bold mb-1">Facile</Text>
                        <Text className="text-gray-400 text-sm">10×10 cases, 20 bombes</Text>
                    </View>

                    <View className="bg-gray-700 rounded-lg p-4 mb-2.5">
                        <Text className="text-blue-400 text-lg font-bold mb-1">Medium</Text>
                        <Text className="text-gray-400 text-sm">20×20 cases, 40 bombes</Text>
                    </View>

                    <View className="bg-gray-700 rounded-lg p-4">
                        <Text className="text-blue-400 text-lg font-bold mb-1">Difficile</Text>
                        <Text className="text-gray-400 text-sm">40×40 cases, 60 bombes</Text>
                    </View>
                </View>

                <View className="bg-gray-800 rounded-xl p-5 mb-5">
                    <Text className="text-blue-400 text-xl font-bold mb-4">💡 Conseils</Text>
                    <Text className="text-gray-200 text-base leading-relaxed">
                        1. Commencez par cliquer au hasard, mais évitez les coins au début.{'\n'}
                        2. Si une case affiche "1" et qu'une seule case adjacente n'est pas découverte,
                        c'est probablement une bombe.{'\n'}
                        3. Les cases vides (sans nombre) révèlent automatiquement les cases adjacentes.
                    </Text>
                </View>

                <View className="bg-gray-800 rounded-xl p-5">
                    <Text className="text-blue-400 text-xl font-bold mb-4">🎵 Options disponibles</Text>
                    <Text className="text-gray-200 text-base leading-relaxed">
                        • Contrôle du volume de la musique{'\n'}
                        • Activation/désactivation des vibrations{'\n'}
                        • Sélection du niveau de difficulté{'\n'}
                        • Sauvegarde des paramètres
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}