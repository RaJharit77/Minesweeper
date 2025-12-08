import { Grid } from '../types/Game';

export const createGrid = (GRID_SIZE: number, BOMBS_COUNT: number): Grid => {
    const grid: Grid = Array(GRID_SIZE).fill(null).map((_, x) =>
        Array(GRID_SIZE).fill(null).map((_, y) => ({
            isBomb: false,
            isRevealed: false,
            adjacentBombs: 0,
            x,
            y,
        }))
    );

    let bombsPlaced = 0;
    while (bombsPlaced < BOMBS_COUNT) {
        const x = Math.floor(Math.random() * GRID_SIZE);
        const y = Math.floor(Math.random() * GRID_SIZE);

        if (!grid[x][y].isBomb) {
            grid[x][y].isBomb = true;
            bombsPlaced++;
        }
    }

    for (let x = 0; x < GRID_SIZE; x++) {
        for (let y = 0; y < GRID_SIZE; y++) {
            if (!grid[x][y].isBomb) {
                let count = 0;
                for (let dx = -1; dx <= 1; dx++) {
                    for (let dy = -1; dy <= 1; dy++) {
                        const nx = x + dx;
                        const ny = y + dy;
                        if (nx >= 0 && nx < GRID_SIZE && ny >= 0 && ny < GRID_SIZE && grid[nx][ny].isBomb) {
                            count++;
                        }
                    }
                }
                grid[x][y].adjacentBombs = count;
            }
        }
    }

    return grid;
};

export const revealCell = (grid: Grid, x: number, y: number, GRID_SIZE: number): Grid => {
    const newGrid = [...grid.map(row => [...row])];
    const cell = newGrid[x][y];

    if (cell.isRevealed) return newGrid;

    cell.isRevealed = true;

    if (cell.adjacentBombs === 0 && !cell.isBomb) {
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                const nx = x + dx;
                const ny = y + dy;
                if (nx >= 0 && nx < GRID_SIZE && ny >= 0 && ny < GRID_SIZE) {
                    revealCell(newGrid, nx, ny, GRID_SIZE);
                }
            }
        }
    }

    return newGrid;
};