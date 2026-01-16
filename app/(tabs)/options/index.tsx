import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Alert,
    Vibration,
    Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import Slider from '@react-native-community/slider';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useGameAudio } from '../../hooks/useGameAudio';
import { useGameStore, Level } from '../../store/useSettingsStore';
import { LEVEL_CONFIGS } from '../../constants/Game';

export default function OptionsScreen() {
    const router = useRouter();
    const {
        volume,
        isVibrationEnabled,
        isSoundEnabled,
        level,
        savedGameId,
        setVolume,
        toggleVibration,
        toggleSound,
        setLevel,
        saveSettings,
        clearGameState,
    } = useGameStore();

    const [localVolume, setLocalVolume] = useState(volume);
    const [localVibration, setLocalVibration] = useState(isVibrationEnabled);
    const [localSoundEnabled, setLocalSoundEnabled] = useState(isSoundEnabled);
    const [localLevel, setLocalLevel] = useState<Level>(level);

    const {
        playBackgroundMusic,
        stopBackgroundMusic,
        updateVolume,
    } = useGameAudio();

    const playTestSound = useCallback(async () => {
        if (!localSoundEnabled) {
            Alert.alert('Info', 'Le son est désactivé. Activez-le pour tester.');
            return;
        }

        try {
            await playBackgroundMusic();

            setTimeout(async () => {
                await stopBackgroundMusic();
            }, 7000);
        } catch (error) {
            console.log('Error playing test sound:', error);
            Alert.alert('Erreur', 'Impossible de jouer le son');
        }
    }, [playBackgroundMusic, stopBackgroundMusic, localSoundEnabled]);

    const testVibration = () => {
        if (localVibration) {
            try {
                Vibration.vibrate(500);
            } catch (error) {
                console.error('Error testing vibration:', error);
                Alert.alert('Erreur', 'Les vibrations ne sont pas disponibles sur cet appareil');
            }
        } else {
            Alert.alert('Info', 'Veuillez activer les vibrations d\'abord');
        }
    };

    const handleSave = () => {
        saveSettings({
            volume: localVolume,
            isVibrationEnabled: localVibration,
            isSoundEnabled: localSoundEnabled,
            level: localLevel,
        });

        updateVolume(localVolume);

        Alert.alert('Succès', 'Paramètres sauvegardés avec succès!', [
            {
                text: 'OK',
                onPress: () => {
                    router.push('/menu');
                },
            },
        ]);

        if (localVibration) {
            try {
                Vibration.vibrate(100);
            } catch (error) {
                console.log('Erreur de vibration lors de la sauvegarde:', error);
            }
        }
    };

    const handleClearSavedGame = () => {
        Alert.alert(
            'Effacer la sauvegarde',
            `Voulez-vous vraiment effacer la partie sauvegardée ? ${savedGameId ? `(ID: ${savedGameId})` : ''}`,
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Effacer',
                    style: 'destructive',
                    onPress: () => {
                        clearGameState();
                        Alert.alert('Succès', 'Partie sauvegardée effacée.');
                    }
                },
            ]
        );
    };

    const handleCancel = () => {
        setLocalVolume(volume);
        setLocalVibration(isVibrationEnabled);
        setLocalSoundEnabled(isSoundEnabled);
        setLocalLevel(level);
        router.back();
    };

    const decreaseVolume = () => {
        const newVolume = Math.max(0, localVolume - 0.1);
        setLocalVolume(newVolume);
        updateVolume(newVolume);
    };

    const increaseVolume = () => {
        const newVolume = Math.min(1, localVolume + 0.1);
        setLocalVolume(newVolume);
        updateVolume(newVolume);
    };

    const toggleSoundEnabled = () => {
        const newSoundEnabled = !localSoundEnabled;
        setLocalSoundEnabled(newSoundEnabled);

        if (!newSoundEnabled) {
            stopBackgroundMusic();
        }
    };

    const levelConfig = LEVEL_CONFIGS[localLevel];

    return (
        <View className="flex-1 bg-gray-900">
            <View className="flex-row items-center justify-between pt-12 px-5 pb-5 bg-gray-800">
                <TouchableOpacity
                    className="p-3 rounded-lg bg-gray-700"
                    onPress={handleCancel}
                >
                    <Ionicons name="arrow-back" size={24} color="#1bb5fc" />
                </TouchableOpacity>

                <View className="flex-1 items-center">
                    <Text className="text-blue-400 text-2xl font-bold">Options</Text>
                    <Text className="text-gray-400 text-sm mt-1">Personnalisez votre expérience</Text>
                </View>

                <View className="w-14" />
            </View>

            <ScrollView
                contentContainerClassName="p-5 pb-10"
                showsVerticalScrollIndicator={false}
            >
                <View className="bg-gray-800 rounded-2xl p-6 mb-6 shadow-lg">
                    <View className="flex-row items-start mb-6">
                        <View className="bg-blue-900 p-3 rounded-xl mr-4 mt-1">
                            <Ionicons name="volume-high" size={28} color="#1bb5fc" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-blue-400 text-xl font-bold mb-1">Volume et Son</Text>
                            <Text className="text-gray-400 text-sm leading-tight max-w-[90%]">
                                Ajustez le volume et activez/désactivez le son
                            </Text>
                        </View>
                    </View>

                    <View className="flex-row items-center justify-between mb-6">
                        <TouchableOpacity
                            className="p-3 bg-red-500/20 rounded-xl active:bg-red-500/30"
                            onPress={decreaseVolume}
                            disabled={!localSoundEnabled}
                        >
                            <Ionicons
                                name="remove-circle-outline"
                                size={36}
                                color={localSoundEnabled ? "#FF3B3B" : "#666"}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="p-3 bg-blue-500/20 rounded-xl active:bg-blue-500/30"
                            onPress={toggleSoundEnabled}
                        >
                            <Ionicons
                                name={localSoundEnabled ? "volume-high" : "volume-mute"}
                                size={40}
                                color={localSoundEnabled ? "#1bb5fc" : "#666"}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="p-3 bg-green-500/20 rounded-xl active:bg-green-500/30"
                            onPress={increaseVolume}
                            disabled={!localSoundEnabled}
                        >
                            <Ionicons
                                name="add-circle-outline"
                                size={36}
                                color={localSoundEnabled ? "#00B300" : "#666"}
                            />
                        </TouchableOpacity>
                    </View>

                    <View className="mb-8">
                        <View className="flex-row items-center justify-between mb-2">
                            <Text className={`text-xs ${localSoundEnabled ? "text-gray-400" : "text-gray-600"}`}>
                                Silence
                            </Text>
                            <View className="flex-row items-center">
                                <Text className={`text-base font-bold mr-2 ${localSoundEnabled ? "text-blue-400" : "text-gray-500"}`}>
                                    {Math.round(localVolume * 100)}%
                                </Text>
                                <View className={`w-8 h-8 rounded-full items-center justify-center ${localSoundEnabled ? "bg-blue-400/20" : "bg-gray-600/20"}`}>
                                    <Text className={`text-xs font-bold ${localSoundEnabled ? "text-blue-400" : "text-gray-500"}`}>
                                        {Math.round(localVolume * 100)}
                                    </Text>
                                </View>
                            </View>
                            <Text className={`text-xs ${localSoundEnabled ? "text-gray-400" : "text-gray-600"}`}>
                                Max
                            </Text>
                        </View>

                        <Slider
                            style={{ width: '100%', height: 40 }}
                            minimumValue={0}
                            maximumValue={1}
                            value={localVolume}
                            onValueChange={(value) => {
                                setLocalVolume(value);
                                updateVolume(value);
                            }}
                            minimumTrackTintColor={localSoundEnabled ? "#1bb5fc" : "#666"}
                            maximumTrackTintColor={localSoundEnabled ? "#374151" : "#444"}
                            thumbTintColor={localSoundEnabled ? "#1bb5fc" : "#666"}
                            disabled={!localSoundEnabled}
                        />
                    </View>

                    <TouchableOpacity
                        className={`py-4 rounded-xl items-center ${localSoundEnabled ? "bg-blue-500 active:opacity-90" : "bg-gray-600"}`}
                        onPress={playTestSound}
                        disabled={!localSoundEnabled}
                    >
                        <View className="flex-row items-center">
                            <Ionicons name="play-circle" size={24} color="white" />
                            <Text className="text-white text-base font-bold ml-3">
                                {localSoundEnabled ? "Tester le son" : "Son désactivé"}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <View className="bg-gray-800 rounded-2xl p-6 mb-6 shadow-lg">
                    <View className="flex-row items-start mb-6">
                        <View className="bg-green-900 p-3 rounded-xl mr-4 mt-1">
                            <MaterialIcons name="vibration" size={28} color="#00B300" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-blue-400 text-xl font-bold mb-1">Vibration</Text>
                            <Text className="text-gray-400 text-sm leading-tight max-w-[90%]">
                                Activez/désactivez les vibrations
                            </Text>
                        </View>
                    </View>

                    <View className="items-center mb-8">
                        <View className="flex-row items-center justify-between w-full mb-8">
                            <View className="flex-1">
                                <Text className="text-gray-200 text-lg font-medium">
                                    {localVibration ? 'Vibration activée' : 'Vibration désactivée'}
                                </Text>
                                <Text className="text-gray-400 text-sm mt-1">
                                    {localVibration
                                        ? 'Le téléphone vibrera lors des événements'
                                        : 'Aucune vibration ne sera déclenchée'}
                                </Text>
                            </View>

                            <TouchableOpacity
                                className={`w-20 h-10 rounded-full p-1 justify-center ${localVibration ? 'bg-green-600' : 'bg-gray-600'}`}
                                onPress={() => setLocalVibration(!localVibration)}
                            >
                                <View
                                    className={`w-8 h-8 rounded-full bg-white shadow-lg ${localVibration ? 'ml-10' : ''}`}
                                    style={localVibration ? { marginLeft: 40 } : {}}
                                />
                            </TouchableOpacity>
                        </View>

                        <View className="my-4">
                            {localVibration ? (
                                <View className="items-center">
                                    <MaterialIcons name="vibration" size={60} color="#00B300" />
                                    <Text className="text-green-400 text-sm mt-2">Vibration active</Text>
                                </View>
                            ) : (
                                <View className="items-center">
                                    <MaterialIcons name="phonelink-erase" size={60} color="#FF3B3B" />
                                    <Text className="text-red-400 text-sm mt-2">Vibration inactive</Text>
                                </View>
                            )}
                        </View>

                        <TouchableOpacity
                            className="bg-green-500 py-4 rounded-xl items-center w-full active:opacity-90"
                            onPress={testVibration}
                            disabled={!localVibration}
                        >
                            <View className="flex-row items-center">
                                <Ionicons name="hand-left-outline" size={24} color="white" />
                                <Text className="text-white text-base font-bold ml-3">
                                    Tester la vibration
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                <View className="bg-gray-800 rounded-2xl p-6 mb-6 shadow-lg">
                    <View className="flex-row items-start mb-6">
                        <View className="bg-purple-900 p-3 rounded-xl mr-4 mt-1">
                            <Ionicons name="bar-chart" size={28} color="#9d4edd" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-blue-400 text-xl font-bold mb-1">Niveau de difficulté</Text>
                            <Text className="text-gray-400 text-sm leading-tight max-w-[90%]">
                                Choisissez la taille de la grille
                            </Text>
                        </View>
                    </View>

                    <View className="mb-6">
                        <View className="bg-gray-700 rounded-xl overflow-hidden border border-gray-600">
                            <Picker
                                selectedValue={localLevel}
                                onValueChange={(itemValue) => setLocalLevel(itemValue)}
                                style={{
                                    color: '#e5e7eb',
                                    height: 60,
                                    backgroundColor: '#1f2937'
                                }}
                                dropdownIconColor="#1bb5fc"
                                mode="dropdown"
                            >
                                <Picker.Item
                                    label="Facile - 10×10 (20 bombes)"
                                    value="easy"
                                    style={{ fontSize: 16 }}
                                />
                                <Picker.Item
                                    label="Medium - 20×20 (40 bombes)"
                                    value="medium"
                                    style={{ fontSize: 16 }}
                                />
                                <Picker.Item
                                    label="Difficile - 40×40 (60 bombes)"
                                    value="difficult"
                                    style={{ fontSize: 16 }}
                                />
                            </Picker>
                        </View>
                    </View>

                    <View className="bg-gray-700/50 rounded-xl p-5 border border-gray-600">
                        <Text className="text-blue-400 text-lg font-bold mb-4 text-center">
                            Détails du niveau
                        </Text>

                        <View className="space-y-3">
                            <View className="flex-row items-center">
                                <View className="bg-blue-900/30 p-2 rounded-lg mr-3">
                                    <Ionicons name="grid" size={20} color="#1bb5fc" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-gray-400 text-sm">Taille de la grille</Text>
                                    <Text className="text-gray-200 text-base font-medium">
                                        {levelConfig.GRID_SIZE} × {levelConfig.GRID_SIZE} cases
                                    </Text>
                                </View>
                                <Text className="text-blue-400 font-bold">
                                    {levelConfig.GRID_SIZE * levelConfig.GRID_SIZE} cases
                                </Text>
                            </View>

                            <View className="flex-row items-center">
                                <View className="bg-red-900/30 p-2 rounded-lg mr-3">
                                    <Ionicons name="nuclear" size={20} color="#FF3B3B" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-gray-400 text-sm">Nombre de bombes</Text>
                                    <Text className="text-gray-200 text-base font-medium">
                                        {levelConfig.BOMBS_COUNT} bombes
                                    </Text>
                                </View>
                                <Text className="text-red-400 font-bold">
                                    {Math.round((levelConfig.BOMBS_COUNT / (levelConfig.GRID_SIZE * levelConfig.GRID_SIZE)) * 100)}% de bombes
                                </Text>
                            </View>

                            <View className="flex-row items-center">
                                <View className="bg-green-900/30 p-2 rounded-lg mr-3">
                                    <Ionicons name="square" size={20} color="#00B300" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-gray-400 text-sm">Taille des cases</Text>
                                    <Text className="text-gray-200 text-base font-medium">
                                        {levelConfig.CELL_SIZE} pixels
                                    </Text>
                                </View>
                                <Text className="text-green-400 font-bold">
                                    {levelConfig.CELL_SIZE}px
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View className="bg-gray-800 rounded-2xl p-6 mb-6 shadow-lg">
                    <View className="flex-row items-start mb-6">
                        <View className="bg-yellow-900 p-3 rounded-xl mr-4 mt-1">
                            <Ionicons name="save" size={28} color="#fbbf24" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-blue-400 text-xl font-bold mb-1">Sauvegarde</Text>
                            <Text className="text-gray-400 text-sm leading-tight max-w-[90%]">
                                {savedGameId ? `Partie sauvegardée (ID: ${savedGameId})` : 'Aucune partie sauvegardée'}
                            </Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        className="bg-red-500 py-4 rounded-xl items-center w-full active:opacity-90 mb-4"
                        onPress={handleClearSavedGame}
                        disabled={!savedGameId}
                    >
                        <View className="flex-row items-center">
                            <Ionicons name="trash-outline" size={24} color="white" />
                            <Text className="text-white text-base font-bold ml-3">
                                {savedGameId ? 'Effacer la partie sauvegardée' : 'Aucune partie à effacer'}
                            </Text>
                        </View>
                    </TouchableOpacity>

                    <Text className="text-gray-400 text-sm text-center">
                        La partie est automatiquement sauvegardée pendant le jeu
                        {savedGameId && ` (ID: ${savedGameId})`}
                    </Text>
                </View>

                <View className="flex-row justify-between">
                    <TouchableOpacity
                        className="flex-1 py-4 rounded-xl items-center bg-red-500 active:opacity-90 mr-2"
                        onPress={handleCancel}
                    >
                        <View className="flex-row items-center">
                            <Ionicons name="close-circle-outline" size={24} color="white" />
                            <Text className="text-white text-lg font-bold ml-2">
                                Annuler
                            </Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="flex-1 py-4 rounded-xl items-center bg-green-500 active:opacity-90 ml-2"
                        onPress={handleSave}
                    >
                        <View className="flex-row items-center">
                            <Ionicons name="save-outline" size={24} color="white" />
                            <Text className="text-white text-lg font-bold ml-2">
                                Sauvegarder
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}