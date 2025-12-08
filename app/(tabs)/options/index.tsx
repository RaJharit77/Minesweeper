import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import Slider from '@react-native-community/slider';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';
import { useGameStore, Level } from '../../store/useSettingsStore';
import { LEVEL_CONFIGS } from '../../constants/Game';

export default function OptionsScreen() {
    const router = useRouter();
    const {
        volume,
        isVibrationEnabled,
        level,
        setVolume,
        toggleVibration,
        setLevel,
        saveSettings,
    } = useGameStore();

    const [localVolume, setLocalVolume] = useState(volume);
    const [localVibration, setLocalVibration] = useState(isVibrationEnabled);
    const [localLevel, setLocalLevel] = useState<Level>(level);
    const [sound, setSound] = useState<Audio.Sound>();

    useEffect(() => {
        return () => {
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, [sound]);

    const playTestSound = async () => {
        try {
            if (sound) {
                await sound.unloadAsync();
            }
            const { sound: newSound } = await Audio.Sound.createAsync(
                require('../../assets/sounds/click.mp3'),
                { volume: localVolume }
            );
            setSound(newSound);
            await newSound.playAsync();
        } catch (error) {
            console.log('Error playing sound:', error);
        }
    };

    const testVibration = async () => {
        if (localVibration) {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
    };

    const handleSave = () => {
        saveSettings({
            volume: localVolume,
            isVibrationEnabled: localVibration,
            level: localLevel,
        });

        Alert.alert('Succès', 'Paramètres sauvegardés avec succès!');

        if (localVibration) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
    };

    const handleCancel = () => {
        setLocalVolume(volume);
        setLocalVibration(isVibrationEnabled);
        setLocalLevel(level);
        router.back();
    };

    const decreaseVolume = () => {
        const newVolume = Math.max(0, localVolume - 0.1);
        setLocalVolume(newVolume);
    };

    const increaseVolume = () => {
        const newVolume = Math.min(1, localVolume + 0.1);
        setLocalVolume(newVolume);
    };

    const levelConfig = LEVEL_CONFIGS[localLevel];

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={handleCancel}
                >
                    <Ionicons name="arrow-back" size={24} color="#1bb5fc" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Options</Text>
                <View style={styles.headerPlaceholder} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Section Volume */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        <Ionicons name="volume-high" size={20} color="#1bb5fc" /> Volume
                    </Text>

                    <View style={styles.volumeControls}>
                        <TouchableOpacity
                            style={styles.volumeButton}
                            onPress={decreaseVolume}
                        >
                            <Ionicons name="remove-circle" size={32} color="#FF3B3B" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.muteButton}
                            onPress={() => setLocalVolume(localVolume > 0 ? 0 : 0.5)}
                        >
                            <Ionicons
                                name={localVolume === 0 ? "volume-mute" : "volume-medium"}
                                size={32}
                                color="#1bb5fc"
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.volumeButton}
                            onPress={increaseVolume}
                        >
                            <Ionicons name="add-circle" size={32} color="#00B300" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.sliderContainer}>
                        <Slider
                            style={styles.slider}
                            minimumValue={0}
                            maximumValue={1}
                            value={localVolume}
                            onValueChange={setLocalVolume}
                            minimumTrackTintColor="#1bb5fc"
                            maximumTrackTintColor="#858889"
                            thumbTintColor="#1bb5fc"
                        />
                        <Text style={styles.volumeText}>{Math.round(localVolume * 100)}%</Text>
                    </View>

                    <TouchableOpacity
                        style={styles.testButton}
                        onPress={playTestSound}
                    >
                        <Text style={styles.testButtonText}>
                            <Ionicons name="play" size={16} color="white" /> Tester le son
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Section Vibration */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        <Ionicons name="phone-portrait" size={20} color="#1bb5fc" /> Vibration
                    </Text>

                    <View style={styles.vibrationContainer}>
                        <View style={styles.vibrationToggle}>
                            <Text style={styles.vibrationText}>
                                Vibration {localVibration ? 'activée' : 'désactivée'}
                            </Text>
                            <TouchableOpacity
                                style={[
                                    styles.toggle,
                                    localVibration ? styles.toggleOn : styles.toggleOff,
                                ]}
                                onPress={() => setLocalVibration(!localVibration)}
                            >
                                <View
                                    style={[
                                        styles.toggleCircle,
                                        localVibration && styles.toggleCircleOn,
                                    ]}
                                />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.vibrationIcon}>
                            {localVibration ? (
                                <MaterialIcons name="vibration" size={40} color="#00B300" />
                            ) : (
                                <MaterialIcons name="phonelink-erase" size={40} color="#FF3B3B" />
                            )}
                        </View>

                        <TouchableOpacity
                            style={styles.testButton}
                            onPress={testVibration}
                        >
                            <Text style={styles.testButtonText}>
                                <Ionicons name="hand-left" size={16} color="white" /> Tester la vibration
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Section Niveau */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        <Ionicons name="bar-chart" size={20} color="#1bb5fc" /> Niveau de difficulté
                    </Text>

                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={localLevel}
                            onValueChange={(itemValue) => setLocalLevel(itemValue)}
                            style={styles.picker}
                            dropdownIconColor="#1bb5fc"
                        >
                            <Picker.Item label="Facile (10×10, 20 bombes)" value="facile" />
                            <Picker.Item label="Medium (20×20, 40 bombes)" value="medium" />
                            <Picker.Item label="Difficile (30×30, 60 bombes)" value="difficle" />
                        </Picker>
                    </View>

                    <View style={styles.levelInfo}>
                        <Text style={styles.levelInfoText}>
                            <Ionicons name="grid" size={16} color="#1bb5fc" /> Grille: {levelConfig.GRID_SIZE}×{levelConfig.GRID_SIZE}
                        </Text>
                        <Text style={styles.levelInfoText}>
                            <Ionicons name="nuclear" size={16} color="#FF3B3B" /> Bombes: {levelConfig.BOMBS_COUNT}
                        </Text>
                        <Text style={styles.levelInfoText}>
                            <Ionicons name="square" size={16} color="#00B300" /> Taille case: {levelConfig.CELL_SIZE}px
                        </Text>
                    </View>
                </View>

                {/* Boutons d'action */}
                <View style={styles.actionButtons}>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.cancelButton]}
                        onPress={handleCancel}
                    >
                        <Text style={styles.cancelButtonText}>Annuler</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.actionButton, styles.saveButton]}
                        onPress={handleSave}
                    >
                        <Ionicons name="save" size={20} color="white" />
                        <Text style={styles.saveButtonText}>Sauvegarder</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1a2e',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 50,
        paddingHorizontal: 20,
        paddingBottom: 20,
        backgroundColor: '#16213e',
    },
    backButton: {
        padding: 10,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1bb5fc',
    },
    headerPlaceholder: {
        width: 44,
    },
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    section: {
        backgroundColor: '#16213e',
        borderRadius: 10,
        padding: 20,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1bb5fc',
        marginBottom: 20,
    },
    volumeControls: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginBottom: 20,
    },
    volumeButton: {
        padding: 10,
    },
    muteButton: {
        padding: 10,
    },
    sliderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    slider: {
        flex: 1,
        height: 40,
    },
    volumeText: {
        color: '#e6e6e6',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 15,
        minWidth: 40,
    },
    testButton: {
        backgroundColor: '#1bb5fc',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    testButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    vibrationContainer: {
        alignItems: 'center',
    },
    vibrationToggle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 20,
    },
    vibrationText: {
        color: '#e6e6e6',
        fontSize: 16,
        fontWeight: '500',
    },
    toggle: {
        width: 60,
        height: 30,
        borderRadius: 15,
        padding: 2,
        justifyContent: 'center',
    },
    toggleOn: {
        backgroundColor: '#00B300',
    },
    toggleOff: {
        backgroundColor: '#858889',
    },
    toggleCircle: {
        width: 26,
        height: 26,
        borderRadius: 13,
        backgroundColor: 'white',
    },
    toggleCircleOn: {
        alignSelf: 'flex-end',
    },
    vibrationIcon: {
        marginVertical: 20,
    },
    pickerContainer: {
        backgroundColor: '#0f3460',
        borderRadius: 8,
        marginBottom: 15,
        overflow: 'hidden',
    },
    picker: {
        color: '#e6e6e6',
        backgroundColor: 'transparent',
    },
    levelInfo: {
        backgroundColor: '#0f3460',
        borderRadius: 8,
        padding: 15,
    },
    levelInfoText: {
        color: '#e6e6e6',
        fontSize: 14,
        marginBottom: 8,
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    actionButton: {
        flex: 1,
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    cancelButton: {
        backgroundColor: '#FF3B3B',
        marginRight: 10,
    },
    saveButton: {
        backgroundColor: '#00B300',
        marginLeft: 10,
    },
    cancelButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    saveButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    },
});