import * as SQLite from 'expo-sqlite';

export interface GameStateRecord {
    id?: number;
    grid: string;
    gameOver: number;
    gameTime: number;
    createdAt?: string;
}

const DATABASE_NAME = 'game.db';

class SqliteService {
    private db: SQLite.SQLiteDatabase | null = null;
    private isInitialized = false;
    private initializationPromise: Promise<void> | null = null;

    async initialize(): Promise<void> {
        if (this.initializationPromise) {
            return this.initializationPromise;
        }

        this.initializationPromise = this.initializeInternal();
        return this.initializationPromise;
    }

    private async initializeInternal(): Promise<void> {
        if (this.isInitialized) {
            return;
        }

        try {
            if (__DEV__) {
                console.log('Opening SQLite database...');
            }

            this.db = await SQLite.openDatabaseAsync(DATABASE_NAME, {
                useNewConnection: true
            });

            if (__DEV__) {
                console.log('SQLite database opened successfully');
            }

            await this.createTable();
            this.isInitialized = true;

            if (__DEV__) {
                console.log('SQLite database initialized successfully');
            }

        } catch (error) {
            if (__DEV__) {
                console.error('Error initializing SQLite database:', error);
            }

            this.isInitialized = false;
            this.db = null;

            throw new Error('SQLite initialization failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
        }
    }

    private async createTable(): Promise<void> {
        if (!this.db) {
            throw new Error('Database not initialized');
        }

        try {
            await this.db.execAsync(`
                CREATE TABLE IF NOT EXISTS game_state (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    grid TEXT NOT NULL,
                    gameOver INTEGER NOT NULL,
                    gameTime INTEGER NOT NULL,
                    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
                );
            `);

            if (__DEV__) {
                console.log('Table created or already exists');
            }
        } catch (error) {
            if (__DEV__) {
                console.error('Error creating table:', error);
            }
            throw error;
        }
    }

    private async ensureInitialized(): Promise<boolean> {
        try {
            await this.initialize();
            return this.isInitialized && this.db !== null;
        } catch (error) {
            if (__DEV__) {
                console.warn('SQLite not available, using fallback storage');
            }
            return false;
        }
    }

    async saveGameState(grid: any, gameOver: boolean, gameTime: number): Promise<boolean> {
        try {
            const isAvailable = await this.ensureInitialized();

            if (!isAvailable || !this.db) {
                return false;
            }

            const serializedGrid = JSON.stringify(grid);

            const existingRecord = await this.db.getFirstAsync<GameStateRecord>(
                'SELECT * FROM game_state ORDER BY id DESC LIMIT 1'
            );

            if (existingRecord && existingRecord.id) {
                return await this.updateGameState(existingRecord.id, grid, gameOver, gameTime);
            } else {
                await this.db.runAsync('DELETE FROM game_state');

                await this.db.runAsync(
                    'INSERT INTO game_state (grid, gameOver, gameTime) VALUES (?, ?, ?)',
                    [serializedGrid, gameOver ? 1 : 0, gameTime]
                );

                if (__DEV__) {
                    console.log('Game state saved to SQLite (new record)');
                }
                return true;
            }

        } catch (error) {
            if (__DEV__) {
                console.error('Error saving game state to SQLite:', error);
            }
            this.isInitialized = false;
            this.db = null;
            return false;
        }
    }

    async updateGameState(id: number, grid: any, gameOver: boolean, gameTime: number): Promise<boolean> {
        try {
            const isAvailable = await this.ensureInitialized();

            if (!isAvailable || !this.db) {
                return false;
            }

            const serializedGrid = JSON.stringify(grid);

            const result = await this.db.runAsync(
                'UPDATE game_state SET grid = ?, gameOver = ?, gameTime = ?, createdAt = CURRENT_TIMESTAMP WHERE id = ?',
                [serializedGrid, gameOver ? 1 : 0, gameTime, id]
            );

            if (__DEV__) {
                console.log(`Game state updated in SQLite for id ${id}:`, result.changes > 0 ? 'Success' : 'No changes');
            }

            return result.changes > 0;

        } catch (error) {
            if (__DEV__) {
                console.error('Error updating game state in SQLite:', error);
            }
            return false;
        }
    }

    async updateGameTime(id: number, gameTime: number): Promise<boolean> {
        try {
            const isAvailable = await this.ensureInitialized();

            if (!isAvailable || !this.db) {
                return false;
            }

            const result = await this.db.runAsync(
                'UPDATE game_state SET gameTime = ?, createdAt = CURRENT_TIMESTAMP WHERE id = ?',
                [gameTime, id]
            );

            if (__DEV__) {
                console.log(`Game time updated for id ${id}`);
            }

            return result.changes > 0;

        } catch (error) {
            if (__DEV__) {
                console.error('Error updating game time in SQLite:', error);
            }
            return false;
        }
    }

    async updateGrid(id: number, grid: any): Promise<boolean> {
        try {
            const isAvailable = await this.ensureInitialized();

            if (!isAvailable || !this.db) {
                return false;
            }

            const serializedGrid = JSON.stringify(grid);

            const result = await this.db.runAsync(
                'UPDATE game_state SET grid = ?, createdAt = CURRENT_TIMESTAMP WHERE id = ?',
                [serializedGrid, id]
            );

            if (__DEV__) {
                console.log(`Grid updated for id ${id}`);
            }

            return result.changes > 0;

        } catch (error) {
            if (__DEV__) {
                console.error('Error updating grid in SQLite:', error);
            }
            return false;
        }
    }

    async loadGameState(): Promise<GameStateRecord | null> {
        try {
            const isAvailable = await this.ensureInitialized();

            if (!isAvailable || !this.db) {
                return null;
            }

            const result = await this.db.getFirstAsync<GameStateRecord>(
                'SELECT * FROM game_state ORDER BY id DESC LIMIT 1'
            );

            if (result) {
                if (__DEV__) {
                    console.log('Game state loaded from SQLite');
                }
                return result;
            }

            if (__DEV__) {
                console.log('No saved game found in SQLite');
            }
            return null;

        } catch (error) {
            if (__DEV__) {
                console.error('Error loading game state from SQLite:', error);
            }
            this.isInitialized = false;
            this.db = null;
            return null;
        }
    }

    async clearGameState(): Promise<boolean> {
        try {
            const isAvailable = await this.ensureInitialized();

            if (!isAvailable || !this.db) {
                return false;
            }

            await this.db.runAsync('DELETE FROM game_state');

            if (__DEV__) {
                console.log('Game state cleared from SQLite');
            }
            return true;

        } catch (error) {
            if (__DEV__) {
                console.error('Error clearing game state from SQLite:', error);
            }
            return false;
        }
    }

    async close(): Promise<void> {
        if (this.db) {
            try {
                await this.db.closeAsync();
                if (__DEV__) {
                    console.log('SQLite database closed');
                }
            } catch (error) {
                if (__DEV__) {
                    console.error('Error closing database:', error);
                }
            } finally {
                this.db = null;
                this.isInitialized = false;
                this.initializationPromise = null;
            }
        }
    }
}

export const sqliteService = new SqliteService();