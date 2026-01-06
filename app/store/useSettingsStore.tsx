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
    savedGrid: string | null;
    savedGameOver: boolean;
    savedGameTime: number;
    isLoading: boolean;
    sqliteError: boolean;
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
    setSqliteError: (error: boolean) => void;
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
            sqliteError: false,

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

                    // Essayer d'abord avec SQLite
                    try {
                        await sqliteService.saveGameState(grid, gameOver, gameTime);
                        console.log('✅ Game state saved to SQLite');
                    } catch (sqliteError) {
                        console.error('❌ SQLite save failed, using fallback:', sqliteError);
                        set({ sqliteError: true });
                        // Fallback: sauvegarder dans AsyncStorage
                        // La grille est déjà sérialisée
                    }

                    // Mise à jour du state local
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
                } catch (error) {
                    console.error('Error clearing game state from SQLite:', error);
                }

                set({
                    savedGrid: null,
                    savedGameOver: false,
                    savedGameTime: 0,
                    sqliteError: false
                });
            },

            saveSettings: (settings) => set((state) => ({
                ...state,
                ...settings
            })),

            loadSavedGame: async () => {
                try {
                    set({ isLoading: true });

                    // Essayer d'abord SQLite
                    try {
                        const savedGame = await sqliteService.loadGameState();

                        if (savedGame) {
                            set({
                                savedGrid: savedGame.grid,
                                savedGameOver: savedGame.gameOver === 1,
                                savedGameTime: savedGame.gameTime,
                                sqliteError: false
                            });
                            console.log('✅ Game state loaded from SQLite');
                            return;
                        }
                    } catch (sqliteError) {
                        console.error('❌ SQLite load failed:', sqliteError);
                        set({ sqliteError: true });
                    }

                    // Si SQLite échoue ou aucune donnée, utiliser AsyncStorage
                    // Les paramètres sont déjà chargés par persist
                    console.log('ℹ️ No game state found in SQLite or fallback used');

                } catch (error) {
                    console.error('Error loading game state:', error);
                    set({ sqliteError: true });
                } finally {
                    set({ isLoading: false });
                }
            },

            setLoading: (loading) => set({ isLoading: loading }),
            setSqliteError: (error) => set({ sqliteError: error }),
        }),
        {
            name: 'game-settings-storage',
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