import { Cell as CellType } from '../Game';

export interface CellProps {
    cell: CellType;
    onPress: () => void;
    gameOver: boolean;
}