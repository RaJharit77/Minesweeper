import { Level } from '../store/useSettingsStore';

export type LevelConfig = {
    GRID_SIZE: number;
    BOMBS_COUNT: number;
    CELL_SIZE: number;
};

export const LEVEL_CONFIGS: Record<Level, LevelConfig> = {
    easy: {
        GRID_SIZE: 10,
        BOMBS_COUNT: 20,
        CELL_SIZE: 28,
    },
    medium: {
        GRID_SIZE: 20,
        BOMBS_COUNT: 40,
        CELL_SIZE: 18,
    },
    difficult: {
        GRID_SIZE: 40,
        BOMBS_COUNT: 60,
        CELL_SIZE: 12,
    },
};

export const getLevelConfig = (level: Level): LevelConfig => {
    return LEVEL_CONFIGS[level];
};

export const NUMBER_COLORS = {
    1: "#00A2FF",
    2: "#00B300",
    3: "#FFD500",
    4: "#FF8C00",
    5: "#FF3B3B",
    6: "#B80000",
};