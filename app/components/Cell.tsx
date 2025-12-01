import React from 'react';
import { TouchableOpacity, Text, Image } from 'react-native';
import { NUMBER_COLORS, CELL_SIZE } from '../constants/Game';
import { CellProps } from '../types/interfaces/CellProps';

const Cell: React.FC<CellProps> = ({ cell, onPress, gameOver }) => {
    const getCellContent = () => {
        if (!cell.isRevealed && !gameOver) {
            return null;
        }

        if (cell.isBomb) {
            return (
                <Image
                    source={{ uri: 'https://drive.google.com/uc?id=1jwiaaT2xhiICj1JEbY28uCcc2qAkgg9K' }}
                    style={{ width: CELL_SIZE, height: CELL_SIZE }}
                />
            );
        }

        if (cell.adjacentBombs > 0) {
            return (
                <Text style={{ color: NUMBER_COLORS[cell.adjacentBombs as keyof typeof NUMBER_COLORS], fontWeight: 'bold' }}>
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
                width: CELL_SIZE,
                height: CELL_SIZE,
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