import { useEffect, useState } from 'react';
import { sqliteService } from '../../app/service/sqliteService';

export const useSqliteCheck = () => {
    const [isSqliteWorking, setIsSqliteWorking] = useState<boolean | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const checkSqlite = async () => {
            try {
                await sqliteService.initialize();

                const testData = { test: 'data' };
                const saveResult = await sqliteService.saveGameState(testData, false, 0);

                if (!saveResult) {
                    throw new Error('Initial save failed');
                }

                const loaded = await sqliteService.loadGameState();

                if (loaded && loaded.id) {
                    const updateData = { test: 'updated data' };
                    const updateResult = await sqliteService.updateGameState(loaded.id, updateData, true, 100);

                    if (!updateResult) {
                        throw new Error('Update failed');
                    }

                    const timeUpdateResult = await sqliteService.updateGameTime(loaded.id, 200);

                    if (!timeUpdateResult) {
                        throw new Error('Time update failed');
                    }

                    const gridUpdateResult = await sqliteService.updateGrid(loaded.id, { test: 'grid updated' });

                    if (!gridUpdateResult) {
                        throw new Error('Grid update failed');
                    }

                    const reloaded = await sqliteService.loadGameState();

                    if (reloaded) {
                        setIsSqliteWorking(true);
                        console.log('SQLite is working correctly with all CRUD operations');
                    } else {
                        setIsSqliteWorking(false);
                        setError('No data loaded after update');
                    }
                } else {
                    setIsSqliteWorking(false);
                    setError('No data loaded from SQLite');
                }

                await sqliteService.clearGameState();

            } catch (err) {
                console.error('SQLite check failed:', err);
                setIsSqliteWorking(false);
                setError(err instanceof Error ? err.message : 'Unknown SQLite error');
            }
        };

        if (__DEV__) {
            checkSqlite();
        } else {
            setIsSqliteWorking(true);
        }
    }, []);

    return { isSqliteWorking, error };
};