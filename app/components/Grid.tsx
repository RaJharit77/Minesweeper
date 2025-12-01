import React from 'react';
import { View } from 'react-native';
import Cell from './Cell';
import { GRID_SIZE, CELL_SIZE } from '../constants/Game';
import { GridProps } from '../types/interfaces/GridProps';

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