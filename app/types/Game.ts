export type Cell = {
    isBomb: boolean;
    isRevealed: boolean;
    adjacentBombs: number;
    x: number;
    y: number;
};

export type Grid = Cell[][];