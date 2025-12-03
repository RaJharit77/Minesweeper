import React, { useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { Grid as GridType } from './types/Game';
import { createGrid, revealCell } from './util/gameLogic';
import Grid from './components/Grid';
import RestartButton from './components/RestartButton';

const GameScreen: React.FC = () => {
  const [grid, setGrid] = useState<GridType>(createGrid());
  const [gameOver, setGameOver] = useState(false);

  const handleCellPress = (x: number, y: number) => {
    const newGrid = revealCell(grid, x, y);

    if (newGrid[x][y].isBomb) {
      setGameOver(true);
      Alert.alert('Game Over', 'Vous avez cliqué sur une bombe !');
      return;
    }

    setGrid([...newGrid]);
  };

  const handleRestart = () => {
    setGrid(createGrid());
    setGameOver(false);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Grid
        grid={grid}
        onCellPress={handleCellPress}
        gameOver={gameOver}
      />

      {gameOver && (
        <View style={{ alignItems: 'center' }}>
          <Text style={{ color: 'red', marginTop: 20 }}>Game Over!</Text>
          <RestartButton onPress={handleRestart} />
        </View>
      )}
    </View>
  );
};

export default GameScreen;