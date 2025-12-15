import { create } from 'zustand';

export type Level = 'easy' | 'medium' | 'difficult';

interface GameSettings {
    volume: number;
    isVibrationEnabled: boolean;
    level: Level;
}

interface GameStore extends GameSettings {
    setVolume: (volume: number) => void;
    toggleVibration: () => void;
    setLevel: (level: Level) => void;
    saveSettings: (settings: Partial<GameSettings>) => void;
}

export const useGameStore = create<GameStore>((set) => ({
    volume: 0.5,
    isVibrationEnabled: true,
    level: 'medium',

    setVolume: (volume) => set({ volume }),

    toggleVibration: () => set((state) => ({
        isVibrationEnabled: !state.isVibrationEnabled
    })),

    setLevel: (level) => set({ level }),

    saveSettings: (settings) => set((state) => ({
        ...state,
        ...settings
    })),
}));