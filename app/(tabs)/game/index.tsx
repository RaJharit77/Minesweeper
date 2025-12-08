import React, { useState, useEffect } from 'react';
import { View, Text, Alert, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Grid as GridType } from '../../types/Game';
import { createGrid, revealCell } from '../../util/gameLogic';
import Grid from '../../components/Grid';
import RestartButton from '../../components/RestartButton';
import { useGameStore } from '../../store/useSettingsStore';
import { getLevelConfig } from '../../constants/Game';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const GameScreen: React.FC = () => {
    const router = useRouter();
    const { isVibrationEnabled, level } = useGameStore();
    const levelConfig = getLevelConfig(level);

    const [grid, setGrid] = useState<GridType>(
        createGrid(levelConfig.GRID_SIZE, levelConfig.BOMBS_COUNT)
    );
    const [gameOver, setGameOver] = useState(false);
    const [zoom, setZoom] = useState(1);
    const [showZoomControls, setShowZoomControls] = useState(false);

    useEffect(() => {
        const gridSize = levelConfig.GRID_SIZE * levelConfig.CELL_SIZE;
        if (gridSize > SCREEN_WIDTH * 0.9) {
            const calculatedZoom = (SCREEN_WIDTH * 0.9) / gridSize;
            setZoom(calculatedZoom);
            setShowZoomControls(true);
        } else {
            setZoom(1);
            setShowZoomControls(false);
        }
    }, [levelConfig]);

    const handleCellPress = (x: number, y: number) => {
        const newGrid = revealCell(grid, x, y, levelConfig.GRID_SIZE);

        if (newGrid[x][y].isBomb) {
            setGameOver(true);
            if (isVibrationEnabled) {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            }
            Alert.alert('Game Over', 'Vous avez cliqué sur une bombe !');
            return;
        }

        setGrid([...newGrid]);
    };

    const handleRestart = () => {
        setGrid(createGrid(levelConfig.GRID_SIZE, levelConfig.BOMBS_COUNT));
        setGameOver(false);
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
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={24} color="#1bb5fc" />
                    <Text style={styles.backText}>Menu</Text>
                </TouchableOpacity>

                <View style={styles.headerInfo}>
                    <Text style={styles.levelText}>Niveau: {level}</Text>
                    <Text style={styles.statsText}>
                        Bombes: {levelConfig.BOMBS_COUNT} | Grille: {levelConfig.GRID_SIZE}×{levelConfig.GRID_SIZE}
                    </Text>
                </View>
            </View>

            <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContainer}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContainer}
                >
                    <View style={[
                        styles.gridContainer,
                        {
                            transform: [{ scale: zoom }],
                            width: levelConfig.GRID_SIZE * levelConfig.CELL_SIZE,
                            height: levelConfig.GRID_SIZE * levelConfig.CELL_SIZE,
                        }
                    ]}>
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
                <View style={styles.zoomControls}>
                    <TouchableOpacity
                        style={styles.zoomButton}
                        onPress={decreaseZoom}
                    >
                        <Ionicons name="remove-circle" size={24} color="#FF3B3B" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.zoomButton}
                        onPress={resetZoom}
                    >
                        <Text style={styles.zoomText}>{Math.round(zoom * 100)}%</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.zoomButton}
                        onPress={increaseZoom}
                    >
                        <Ionicons name="add-circle" size={24} color="#00B300" />
                    </TouchableOpacity>
                </View>
            )}

            <View style={styles.footer}>
                {gameOver && (
                    <View style={styles.gameOverContainer}>
                        <Text style={styles.gameOverText}>Game Over!</Text>
                        <RestartButton onPress={handleRestart} />
                    </View>
                )}

                {!gameOver && (
                    <RestartButton onPress={handleRestart} />
                )}
            </View>
        </View>
    );
};

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
        flexDirection: 'row',
        alignItems: 'center',
    },
    backText: {
        color: '#1bb5fc',
        fontSize: 16,
        marginLeft: 10,
        fontWeight: '500',
    },
    headerInfo: {
        alignItems: 'flex-end',
    },
    levelText: {
        color: '#1bb5fc',
        fontSize: 16,
        fontWeight: 'bold',
    },
    statsText: {
        color: '#858889',
        fontSize: 12,
        marginTop: 2,
    },
    scrollContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flexGrow: 1,
    },
    gridContainer: {
        marginVertical: 20,
    },
    zoomControls: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#16213e',
        padding: 10,
        marginHorizontal: 20,
        borderRadius: 25,
        marginBottom: 20,
    },
    zoomButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    zoomText: {
        color: '#1bb5fc',
        fontSize: 16,
        fontWeight: 'bold',
    },
    footer: {
        padding: 20,
        alignItems: 'center',
    },
    gameOverContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    gameOverText: {
        color: 'red',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
});

export default GameScreen;