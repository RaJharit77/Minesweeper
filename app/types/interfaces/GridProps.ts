import { Grid as GridType } from '../Game';

export interface GridProps {
    grid: GridType
    onCellPress: (x: number, y: number) => void;
    gameOver: boolean;
    cellSize: number;
}