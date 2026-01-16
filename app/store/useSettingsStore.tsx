import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { persistStorage } from './persistStorage';
import { sqliteService } from '../../app/service/sqliteService';

export type Level = 'easy' | 'medium' | 'difficult';

interface GameSettings {
    volume: number;
    isVibrationEnabled: boolean;
    isSoundEnabled: boolean;
    level: Level;
}

interface GameState {
    savedGrid: string | null;
    savedGameOver: boolean;
    savedGameTime: number;
    isLoading: boolean;
    isSqliteAvailable: boolean;
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
    setSqliteAvailable: (available: boolean) => void;
    sqliteError: string | null;
    clearSqliteError: () => void;
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
            isSqliteAvailable: true,
            sqliteError: null as string | null,

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

                    set({
                        savedGrid: serializedGrid,
                        savedGameOver: gameOver,
                        savedGameTime: gameTime
                    });

                    if (get().isSqliteAvailable) {
                        try {
                            const success = await sqliteService.saveGameState(grid, gameOver, gameTime);

                            if (!success) {
                                set({ isSqliteAvailable: false, sqliteError: 'Failed to save to SQLite' });
                            }
                        } catch (sqliteError) {
                            if (__DEV__) {
                                console.error('SQLite save failed:', sqliteError);
                            }
                            set({
                                isSqliteAvailable: false,
                                sqliteError: sqliteError instanceof Error ? sqliteError.message : 'Unknown SQLite error'
                            });
                        }
                    }

                } catch (error) {
                    if (__DEV__) {
                        console.error('Error saving game state:', error);
                    }
                }
            },

            clearGameState: async () => {
                set({
                    savedGrid: null,
                    savedGameOver: false,
                    savedGameTime: 0
                });

                if (get().isSqliteAvailable) {
                    try {
                        await sqliteService.clearGameState();
                    } catch (error) {
                        if (__DEV__) {
                            console.error('Error clearing SQLite:', error);
                        }
                        set({ isSqliteAvailable: false });
                    }
                }
            },

            saveSettings: (settings) => set((state) => ({
                ...state,
                ...settings
            })),

            loadSavedGame: async () => {
                try {
                    set({ isLoading: true });

                    if (get().isSqliteAvailable) {
                        try {
                            const savedGame = await sqliteService.loadGameState();

                            if (savedGame) {
                                set({
                                    savedGrid: savedGame.grid,
                                    savedGameOver: savedGame.gameOver === 1,
                                    savedGameTime: savedGame.gameTime,
                                    isSqliteAvailable: true,
                                    sqliteError: null
                                });
                                return;
                            }
                        } catch (sqliteError) {
                            if (__DEV__) {
                                console.error('SQLite load failed, using AsyncStorage:', sqliteError);
                            }
                            set({
                                isSqliteAvailable: false,
                                sqliteError: sqliteError instanceof Error ? sqliteError.message : 'SQLite load failed'
                            });
                        }
                    }

                    if (__DEV__) {
                        console.log('Using AsyncStorage data');
                    }

                } catch (error) {
                    if (__DEV__) {
                        console.error('Error loading game state:', error);
                    }
                } finally {
                    set({ isLoading: false });
                }
            },

            setLoading: (loading) => set({ isLoading: loading }),
            setSqliteAvailable: (available) => set({ isSqliteAvailable: available }),
            clearSqliteError: () => set({ sqliteError: null }),
        }),
        {
            name: 'game-storage',
            storage: createJSONStorage(() => persistStorage),
            version: 1,
            partialize: (state) => ({
                volume: state.volume,
                isVibrationEnabled: state.isVibrationEnabled,
                isSoundEnabled: state.isSoundEnabled,
                level: state.level,
                savedGrid: state.savedGrid,
                savedGameOver: state.savedGameOver,
                savedGameTime: state.savedGameTime,
                isSqliteAvailable: state.isSqliteAvailable,
            }),
            migrate: (persistedState: any, version: number) => {
                if (version === 0) {
                    return {
                        ...persistedState,
                        savedGrid: null,
                        savedGameOver: false,
                        savedGameTime: 0,
                        isSqliteAvailable: true,
                        sqliteError: null,
                    };
                }
                return persistedState as GameStore;
            },
        }
    )
);