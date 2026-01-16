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
                await sqliteService.saveGameState(testData, false, 0);
                const loaded = await sqliteService.loadGameState();

                if (loaded) {
                    setIsSqliteWorking(true);
                    console.log('SQLite is working correctly');
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