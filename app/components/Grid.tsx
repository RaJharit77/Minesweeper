import React from 'react';
import { View } from 'react-native';
import Cell from './Cell';
import { GridProps } from '../types/interfaces/GridProps';

const Grid: React.FC<GridProps> = ({ grid, onCellPress, gameOver, cellSize }) => {
    const gridSize = grid.length;

    return (
        <View 
            className="flex-row flex-wrap"
            style={{ width: gridSize * cellSize }}
        >
            {grid.flat().map((cell, index) => (
                <Cell
                    key={index}
                    cell={cell}
                    onPress={() => onCellPress(cell.x, cell.y)}
                    gameOver={gameOver}
                    cellSize={cellSize}
                />
            ))}
        </View>
    );
};

export default Grid;