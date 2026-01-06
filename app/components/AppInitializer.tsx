import React, { useEffect } from 'react';
import { useGameStore } from '../store/useSettingsStore';

const AppInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { loadSavedGame, isLoading } = useGameStore();

    useEffect(() => {
        const loadGame = async () => {
            await loadSavedGame();
        };

        loadGame();
    }, []);

    return <>{children}</>;
};

export default AppInitializer;