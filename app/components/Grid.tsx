import React from 'react';
import { View } from 'react-native';
import { Grid as GridType } from '../types/Game';
import Cell from './Cell';
import { GRID_SIZE, CELL_SIZE } from '../constants/Game';

interface GridProps {
    grid: GridType;
    onCellPress: (x: number, y: number) => void;
    gameOver: boolean;
}

const Grid: React.FC<GridProps> = ({ grid, onCellPress, gameOver }) => {
    return (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', width: GRID_SIZE * CELL_SIZE }}>
            {grid.flat().map((cell, index) => (
                <Cell
                    key={index}
                    cell={cell}
                    onPress={() => onCellPress(cell.x, cell.y)}
                    gameOver={gameOver}
                />
            ))}
        </View>
    );
};

export default Grid;