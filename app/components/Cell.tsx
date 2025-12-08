import React from 'react';
import { TouchableOpacity, Text, Image } from 'react-native';
import { NUMBER_COLORS } from '../constants/Game';
import { CellProps } from '../types/interfaces/CellProps';

const Cell: React.FC<CellProps> = ({ cell, onPress, gameOver, cellSize }) => {
    const getCellContent = () => {
        if (!cell.isRevealed && !gameOver) {
            return null;
        }

        if (cell.isBomb) {
            return (
                <Image
                    source={require('../../assets/images/bomb.png')}
                    style={{ width: cellSize, height: cellSize }}
                />
            );
        }

        if (cell.adjacentBombs > 0) {
            return (
                <Text style={{
                    color: NUMBER_COLORS[cell.adjacentBombs as keyof typeof NUMBER_COLORS],
                    fontWeight: 'bold',
                    fontSize: cellSize * 0.6
                }}>
                    {cell.adjacentBombs}
                </Text>
            );
        }

        return null;
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={cell.isRevealed || gameOver}
            style={{
                width: cellSize,
                height: cellSize,
                backgroundColor: cell.isRevealed || gameOver ? '#858889' : '#1bb5fc',
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: '#fff',
            }}
        >
            {getCellContent()}
        </TouchableOpacity>
    );
};

export default Cell;