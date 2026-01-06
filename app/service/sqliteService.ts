import * as SQLite from 'expo-sqlite';

export interface GameStateRecord {
    id?: number;
    grid: string;
    gameOver: number;
    gameTime: number;
    createdAt?: string;
}

const DATABASE_NAME = 'minesweeper.db';

class SqliteService {
    private db: SQLite.SQLiteDatabase | null = null;

    async initialize(): Promise<void> {
        try {
            this.db = await SQLite.openDatabaseAsync(DATABASE_NAME);
            await this.createTable();
            console.log('SQLite database initialized');
        } catch (error) {
            console.error('Error initializing SQLite database:', error);
            throw error;
        }
    }

    private async createTable(): Promise<void> {
        if (!this.db) {
            throw new Error('Database not initialized');
        }

        await this.db.execAsync(`
            CREATE TABLE IF NOT EXISTS game_state (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                grid TEXT NOT NULL,
                gameOver INTEGER NOT NULL,
                gameTime INTEGER NOT NULL,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        `);
    }

    async saveGameState(grid: any, gameOver: boolean, gameTime: number): Promise<void> {
        if (!this.db) {
            await this.initialize();
        }

        try {
            const serializedGrid = JSON.stringify(grid);

            await this.db!.runAsync('DELETE FROM game_state');

            await this.db!.runAsync(
                'INSERT INTO game_state (grid, gameOver, gameTime) VALUES (?, ?, ?)',
                [serializedGrid, gameOver ? 1 : 0, gameTime]
            );

            console.log('Game state saved to SQLite');
        } catch (error) {
            console.error('Error saving game state to SQLite:', error);
            throw error;
        }
    }

    async loadGameState(): Promise<GameStateRecord | null> {
        if (!this.db) {
            await this.initialize();
        }

        try {
            const result = await this.db!.getFirstAsync<GameStateRecord>(
                'SELECT * FROM game_state ORDER BY id DESC LIMIT 1'
            );

            if (result) {
                console.log('Game state loaded from SQLite');
                return result;
            }
            return null;
        } catch (error) {
            console.error('Error loading game state from SQLite:', error);
            return null;
        }
    }

    async clearGameState(): Promise<void> {
        if (!this.db) {
            await this.initialize();
        }

        try {
            await this.db!.runAsync('DELETE FROM game_state');
            console.log('Game state cleared from SQLite');
        } catch (error) {
            console.error('Error clearing game state from SQLite:', error);
            throw error;
        }
    }

    async close(): Promise<void> {
        if (this.db) {
            await this.db.closeAsync();
            console.log('SQLite database closed');
        }
    }
}

export const sqliteService = new SqliteService();