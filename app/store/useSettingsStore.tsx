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
    savedGameId: number | null;
    isLoading: boolean;
    isSqliteAvailable: boolean;
}

interface GameStore extends GameSettings, GameState {
    setVolume: (volume: number) => void;
    toggleVibration: () => void;
    toggleSound: () => void;
    setLevel: (level: Level) => void;
    saveGameState: (grid: any, gameOver: boolean, gameTime: number) => Promise<void>;
    updateGameState: (grid: any, gameOver: boolean, gameTime: number) => Promise<void>;
    updateGameTime: (gameTime: number) => Promise<void>; 
    updateGrid: (grid: any) => Promise<void>; 
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
            savedGameId: null,
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
                            } else {
                                const savedGame = await sqliteService.loadGameState();
                                if (savedGame && savedGame.id) {
                                    set({ savedGameId: savedGame.id });
                                }
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

            updateGameState: async (grid, gameOver, gameTime) => {
                try {
                    const serializedGrid = JSON.stringify(grid);
                    const { savedGameId, isSqliteAvailable } = get();

                    set({
                        savedGrid: serializedGrid,
                        savedGameOver: gameOver,
                        savedGameTime: gameTime
                    });

                    if (isSqliteAvailable && savedGameId) {
                        try {
                            const success = await sqliteService.updateGameState(savedGameId, grid, gameOver, gameTime);

                            if (!success) {
                                console.warn('Update failed, trying to save as new');
                                await get().saveGameState(grid, gameOver, gameTime);
                            }
                        } catch (error) {
                            if (__DEV__) {
                                console.error('Error updating game state in SQLite:', error);
                            }
                        }
                    } else if (isSqliteAvailable) {
                        await get().saveGameState(grid, gameOver, gameTime);
                    }
                } catch (error) {
                    if (__DEV__) {
                        console.error('Error updating game state:', error);
                    }
                }
            },

            updateGameTime: async (gameTime) => {
                try {
                    const { savedGameId, isSqliteAvailable, savedGrid, savedGameOver } = get();

                    set({ savedGameTime: gameTime });

                    if (isSqliteAvailable && savedGameId && savedGrid) {
                        try {
                            await sqliteService.updateGameTime(savedGameId, gameTime);
                        } catch (error) {
                            if (__DEV__) {
                                console.error('Error updating game time in SQLite:', error);
                            }
                        }
                    }
                } catch (error) {
                    if (__DEV__) {
                        console.error('Error updating game time:', error);
                    }
                }
            },

            updateGrid: async (grid) => {
                try {
                    const serializedGrid = JSON.stringify(grid);
                    const { savedGameId, isSqliteAvailable, savedGameOver, savedGameTime } = get();

                    set({ savedGrid: serializedGrid });

                    if (isSqliteAvailable && savedGameId) {
                        try {
                            await sqliteService.updateGrid(savedGameId, grid);
                        } catch (error) {
                            if (__DEV__) {
                                console.error('Error updating grid in SQLite:', error);
                            }
                        }
                    }
                } catch (error) {
                    if (__DEV__) {
                        console.error('Error updating grid:', error);
                    }
                }
            },

            clearGameState: async () => {
                set({
                    savedGrid: null,
                    savedGameOver: false,
                    savedGameTime: 0,
                    savedGameId: null
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
                                    savedGameId: savedGame.id || null,
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
            version: 2,
            partialize: (state) => ({
                volume: state.volume,
                isVibrationEnabled: state.isVibrationEnabled,
                isSoundEnabled: state.isSoundEnabled,
                level: state.level,
                savedGrid: state.savedGrid,
                savedGameOver: state.savedGameOver,
                savedGameTime: state.savedGameTime,
                savedGameId: state.savedGameId,
                isSqliteAvailable: state.isSqliteAvailable,
            }),
            migrate: (persistedState: any, version: number) => {
                if (version === 0) {
                    return {
                        ...persistedState,
                        savedGrid: null,
                        savedGameOver: false,
                        savedGameTime: 0,
                        savedGameId: null,
                        isSqliteAvailable: true,
                        sqliteError: null,
                    };
                }
                if (version === 1) {
                    return {
                        ...persistedState,
                        savedGameId: null,
                    };
                }
                return persistedState as GameStore;
            },
        }
    )
);