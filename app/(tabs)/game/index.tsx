import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Alert,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    Vibration,
    Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { Grid as GridType } from '../../types/Game';
import { createGrid, revealCell } from '../../util/gameLogic';
import Grid from '../../components/Grid';
import RestartButton from '../../components/RestartButton';
import { useGameStore } from '../../store/useSettingsStore';
import { getLevelConfig } from '../../constants/Game';
import { Ionicons } from '@expo/vector-icons';
import { useGameAudio } from '../../hooks/useGameAudio';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const GameScreen: React.FC = () => {
    const router = useRouter();
    const { isVibrationEnabled, level } = useGameStore();
    const levelConfig = getLevelConfig(level);
    
    const {
        playBackgroundMusic,
        stopBackgroundMusic,
        playGameOverSound,
        stopGameOverSound,
        isBackgroundMusicPlaying,
        toggleBackgroundMusic
    } = useGameAudio();

    const [grid, setGrid] = useState<GridType>(
        createGrid(levelConfig.GRID_SIZE, levelConfig.BOMBS_COUNT)
    );
    const [gameOver, setGameOver] = useState(false);
    const [zoom, setZoom] = useState(1);
    const [showZoomControls, setShowZoomControls] = useState(false);

    useEffect(() => {
        playBackgroundMusic();

        const gridSize = levelConfig.GRID_SIZE * levelConfig.CELL_SIZE;
        if (gridSize > SCREEN_WIDTH * 0.9) {
            const calculatedZoom = (SCREEN_WIDTH * 0.9) / gridSize;
            setZoom(calculatedZoom);
            setShowZoomControls(true);
        } else {
            setZoom(1);
            setShowZoomControls(false);
        }

        return () => {
            stopBackgroundMusic();
            stopGameOverSound();
        };
    }, [levelConfig]);

    const handleCellPress = async (x: number, y: number) => {
        const newGrid = revealCell(grid, x, y, levelConfig.GRID_SIZE);

        if (newGrid[x][y].isBomb) {
            setGameOver(true);

            await playGameOverSound();

            if (isVibrationEnabled) {
                try {
                    if (Platform.OS === 'android') {
                        Vibration.vibrate([0, 500, 200, 500]);
                    } else {
                        Vibration.vibrate([0, 500]);
                    }
                } catch (error) {
                    console.log('Erreur de vibration:', error);
                }
            }

            Alert.alert(
                'Game Over',
                'Vous avez cliqué sur une bombe !',
                [
                    {
                        text: 'OK',
                        onPress: () => stopGameOverSound(),
                    },
                ]
            );
            return;
        }

        setGrid([...newGrid]);
    };

    const handleRestart = async () => {
        await stopGameOverSound();
        setGrid(createGrid(levelConfig.GRID_SIZE, levelConfig.BOMBS_COUNT));
        setGameOver(false);
        
        if (!isBackgroundMusicPlaying) {
            playBackgroundMusic();
        }
    };

    const increaseZoom = () => {
        setZoom(Math.min(zoom + 0.1, 1.5));
    };

    const decreaseZoom = () => {
        setZoom(Math.max(zoom - 0.1, 0.5));
    };

    const resetZoom = () => {
        setZoom(1);
    };

    return (
        <View className="flex-1 bg-gray-900">
            <View className="flex-row items-center justify-between pt-12 px-5 pb-5 bg-gray-800">
                <TouchableOpacity
                    className="flex-row items-center"
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={24} color="#1bb5fc" />
                    <Text className="text-blue-400 text-base ml-2 font-medium">Menu</Text>
                </TouchableOpacity>

                <View className="items-end">
                    <Text className="text-blue-400 text-base font-bold">Niveau: {level}</Text>
                    <Text className="text-gray-400 text-xs mt-0.5">
                        Bombes: {levelConfig.BOMBS_COUNT} | Grille: {levelConfig.GRID_SIZE}×{levelConfig.GRID_SIZE}
                    </Text>
                </View>
            </View>

            <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerClassName="items-center justify-center flex-grow"
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerClassName="items-center justify-center flex-grow"
                >
                    <View 
                        className="my-5"
                        style={{
                            transform: [{ scale: zoom }],
                            width: levelConfig.GRID_SIZE * levelConfig.CELL_SIZE,
                            height: levelConfig.GRID_SIZE * levelConfig.CELL_SIZE,
                        }}
                    >
                        <Grid
                            grid={grid}
                            onCellPress={handleCellPress}
                            gameOver={gameOver}
                            cellSize={levelConfig.CELL_SIZE}
                        />
                    </View>
                </ScrollView>
            </ScrollView>

            {showZoomControls && (
                <View className="flex-row justify-center items-center bg-gray-800 mx-5 p-3 rounded-full mb-5">
                    <TouchableOpacity
                        className="px-5 py-2.5"
                        onPress={decreaseZoom}
                    >
                        <Ionicons name="remove-circle" size={24} color="#FF3B3B" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="px-5 py-2.5"
                        onPress={resetZoom}
                    >
                        <Text className="text-blue-400 text-base font-bold">{Math.round(zoom * 100)}%</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="px-5 py-2.5"
                        onPress={increaseZoom}
                    >
                        <Ionicons name="add-circle" size={24} color="#00B300" />
                    </TouchableOpacity>
                </View>
            )}

            <View className="p-5 items-center">
                {gameOver ? (
                    <View className="items-center mb-5 w-full">
                        <Text className="text-red-500 text-2xl font-bold mb-5">💣 Game Over! 💣</Text>
                        <RestartButton onPress={handleRestart} />
                    </View>
                ) : (
                    <TouchableOpacity
                        className="bg-blue-400 px-6 py-4 rounded flex-row items-center justify-center mt-5 min-w-[200px]"
                        onPress={handleRestart}
                    >
                        <Ionicons name="refresh" size={20} color="white" />
                        <Text className="text-white text-center ml-2 text-base font-bold">Recommencer</Text>
                    </TouchableOpacity>
                )}

                {/* Bouton pour contrôler la musique */}
                <TouchableOpacity
                    className="mt-4 p-3 bg-gray-800 rounded-lg flex-row items-center"
                    onPress={toggleBackgroundMusic}
                >
                    <Ionicons 
                        name={isBackgroundMusicPlaying ? "volume-high" : "volume-mute"} 
                        size={20} 
                        color="#1bb5fc" 
                    />
                    <Text className="text-blue-400 ml-2">
                        {isBackgroundMusicPlaying ? 'Musique ON' : 'Musique OFF'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default GameScreen;