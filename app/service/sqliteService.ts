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
    private isInitialized = false;

    async initialize(): Promise<void> {
        if (this.isInitialized) {
            return;
        }

        try {
            console.log('Opening SQLite database...');
            this.db = await SQLite.openDatabaseAsync(DATABASE_NAME);
            await this.createTable();
            this.isInitialized = true;
            console.log('SQLite database initialized successfully');
        } catch (error) {
            console.error('Error initializing SQLite database:', error);
            this.isInitialized = false;
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

    private async ensureInitialized(): Promise<void> {
        if (!this.isInitialized || !this.db) {
            await this.initialize();
        }
    }

    async saveGameState(grid: any, gameOver: boolean, gameTime: number): Promise<void> {
        await this.ensureInitialized();

        try {
            const serializedGrid = JSON.stringify(grid);

            // Supprimer les anciennes sauvegardes
            await this.db!.runAsync('DELETE FROM game_state');

            // Insérer la nouvelle sauvegarde
            await this.db!.runAsync(
                'INSERT INTO game_state (grid, gameOver, gameTime) VALUES (?, ?, ?)',
                [serializedGrid, gameOver ? 1 : 0, gameTime]
            );

            console.log('Game state saved to SQLite');
        } catch (error) {
            console.error('Error saving game state to SQLite:', error);
            // Réessayer l'initialisation
            this.isInitialized = false;
            throw error;
        }
    }

    async loadGameState(): Promise<GameStateRecord | null> {
        await this.ensureInitialized();

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
            this.isInitialized = false;
            return null;
        }
    }

    async clearGameState(): Promise<void> {
        await this.ensureInitialized();

        try {
            await this.db!.runAsync('DELETE FROM game_state');
            console.log('Game state cleared from SQLite');
        } catch (error) {
            console.error('Error clearing game state from SQLite:', error);
            this.isInitialized = false;
            throw error;
        }
    }

    async close(): Promise<void> {
        if (this.db) {
            await this.db.closeAsync();
            this.db = null;
            this.isInitialized = false;
            console.log('SQLite database closed');
        }
    }
}

export const sqliteService = new SqliteService();