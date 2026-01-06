import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { persistStorage } from './persistStorage';
import { sqliteService } from '../service/sqliteService';

export type Level = 'easy' | 'medium' | 'difficult';

interface GameSettings {
    volume: number;
    isVibrationEnabled: boolean;
    isSoundEnabled: boolean;
    level: Level;
}

interface GameState {
    savedGrid: any | null;
    savedGameOver: boolean;
    savedGameTime: number;
    isLoading: boolean;
}

interface GameStore extends GameSettings, GameState {
    setVolume: (volume: number) => void;
    toggleVibration: () => void;
    toggleSound: () => void;
    setLevel: (level: Level) => void;
    saveGameState: (grid: any, gameOver: boolean, gameTime: number) => Promise<void>;
    clearGameState: () => Promise<void>;
    saveSettings: (settings: Partial<GameSettings>) => void;
    loadSavedGame: () => Promise<void>;
    setLoading: (loading: boolean) => void;
}

export const useGameStore = create<GameStore>()(
    persist(
        (set, get) => ({
            volume: 0.5,
            isVibrationEnabled: true,
            isSoundEnabled: true,
            level: 'medium',

            savedGrid: null,
            savedGameOver: false,
            savedGameTime: 0,
            isLoading: false,

            setVolume: (volume) => set({ volume }),

            toggleVibration: () => set((state) => ({
                isVibrationEnabled: !state.isVibrationEnabled
            })),

            toggleSound: () => set((state) => ({
                isSoundEnabled: !state.isSoundEnabled
            })),

            setLevel: (level) => set({ level }),

            saveGameState: async (grid, gameOver, gameTime) => {
                try {
                    const serializedGrid = JSON.stringify(grid);

                    // Sauvegarde dans SQLite
                    await sqliteService.saveGameState(grid, gameOver, gameTime);

                    // Mise à jour du state local pour l'interface
                    set({
                        savedGrid: serializedGrid,
                        savedGameOver: gameOver,
                        savedGameTime: gameTime
                    });
                } catch (error) {
                    console.error('Error saving game state:', error);
                }
            },

            clearGameState: async () => {
                try {
                    await sqliteService.clearGameState();
                    set({
                        savedGrid: null,
                        savedGameOver: false,
                        savedGameTime: 0
                    });
                } catch (error) {
                    console.error('Error clearing game state:', error);
                }
            },

            saveSettings: (settings) => set((state) => ({
                ...state,
                ...settings
            })),

            loadSavedGame: async () => {
                try {
                    set({ isLoading: true });
                    const savedGame = await sqliteService.loadGameState();

                    if (savedGame) {
                        set({
                            savedGrid: savedGame.grid,
                            savedGameOver: savedGame.gameOver === 1,
                            savedGameTime: savedGame.gameTime
                        });
                        console.log('Game state loaded from SQLite');
                    }
                } catch (error) {
                    console.error('Error loading game state:', error);
                } finally {
                    set({ isLoading: false });
                }
            },

            setLoading: (loading) => set({ isLoading: loading }),
        }),
        {
            name: 'game-settings-storage',
            storage: createJSONStorage(() => persistStorage),
            version: 1,
            partialize: (state) => ({
                // On ne persiste QUE les paramètres dans AsyncStorage
                volume: state.volume,
                isVibrationEnabled: state.isVibrationEnabled,
                isSoundEnabled: state.isSoundEnabled,
                level: state.level,
            }),
            migrate: (persistedState: any, version: number) => {
                if (version === 0) {
                    return {
                        ...persistedState,
                        savedGrid: null,
                        savedGameOver: false,
                        savedGameTime: 0,
                    };
                }
                return persistedState as GameStore;
            },
        }
    )
);