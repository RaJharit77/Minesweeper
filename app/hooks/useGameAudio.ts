import { useState, useEffect, useCallback } from 'react';
import { useAudioPlayer, AudioModule } from 'expo-audio';
import { useGameStore } from '../store/useSettingsStore';

export const useGameAudio = () => {
    const { volume, isVibrationEnabled, isSoundEnabled } = useGameStore();
    const [isBackgroundMusicPlaying, setIsBackgroundMusicPlaying] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    const backgroundPlayer = useAudioPlayer(require('../../assets/sounds/background.mp3'));
    const gameOverPlayer = useAudioPlayer(require('../../assets/sounds/game_over.mp3'));
    const clickPlayer = useAudioPlayer(require('../../assets/sounds/click.mp3'));

    useEffect(() => {
        const configureAudio = async () => {
            try {
                await AudioModule.setAudioModeAsync({
                    allowsRecording: false,
                    playsInSilentMode: true,
                });
                setIsInitialized(true);
                console.log('Audio configured successfully');
            } catch (error) {
                console.error('Error configuring audio:', error);
            }
        };

        configureAudio();

        return () => {
            if (backgroundPlayer?.pause) backgroundPlayer.pause();
            if (gameOverPlayer?.pause) gameOverPlayer.pause();
            if (clickPlayer?.pause) clickPlayer.pause();
        };
    }, []);

    useEffect(() => {
        if (!isInitialized) return;

        if (!isSoundEnabled && isBackgroundMusicPlaying) {
            backgroundPlayer.pause();
            setIsBackgroundMusicPlaying(false);
        }

        if (backgroundPlayer && gameOverPlayer && clickPlayer) {
            if (isSoundEnabled) {
                backgroundPlayer.volume = volume * 0.5;
                gameOverPlayer.volume = volume * 0.7;
                clickPlayer.volume = volume * 0.3;
            } else {
                backgroundPlayer.volume = 0;
                gameOverPlayer.volume = 0;
                clickPlayer.volume = 0;
            }
        }
    }, [isSoundEnabled, volume, isInitialized]);

    const playBackgroundMusic = useCallback(async () => {
        if (!isInitialized || !isSoundEnabled) return;

        try {
            await backgroundPlayer.play();
            setIsBackgroundMusicPlaying(true);
            console.log('Background music started (covers game sounds)');
        } catch (error) {
            console.error('Error playing background music:', error);
        }
    }, [backgroundPlayer, isInitialized, isSoundEnabled]);

    const stopBackgroundMusic = useCallback(async () => {
        if (!isInitialized) return;

        try {
            await backgroundPlayer.pause();
            setIsBackgroundMusicPlaying(false);
            console.log('Background music stopped');
        } catch (error) {
            console.error('Error stopping background music:', error);
        }
    }, [backgroundPlayer, isInitialized]);

    const playGameOverSound = useCallback(async () => {
        if (!isInitialized || !isSoundEnabled) return;

        try {
            await stopBackgroundMusic();

            await gameOverPlayer.play();
            console.log('Game over sound played');

            setTimeout(async () => {
                await gameOverPlayer.pause();
                if (isSoundEnabled) {
                    await playBackgroundMusic();
                }
            }, 3000);
        } catch (error) {
            console.error('Error playing game over sound:', error);
        }
    }, [gameOverPlayer, stopBackgroundMusic, playBackgroundMusic, isInitialized, isSoundEnabled]);

    const stopGameOverSound = useCallback(async () => {
        if (!isInitialized) return;

        try {
            await gameOverPlayer.pause();
            console.log('Game over sound stopped');
        } catch (error) {
            console.error('Error stopping game over sound:', error);
        }
    }, [gameOverPlayer, isInitialized]);

    const updateVolume = useCallback(async (newVolume: number) => {
        if (!isInitialized) return;

        try {
            if (isSoundEnabled) {
                backgroundPlayer.volume = newVolume * 0.5;
                gameOverPlayer.volume = newVolume * 0.7;
                clickPlayer.volume = newVolume * 0.3;
            }
        } catch (error) {
            console.error('Error updating volume:', error);
        }
    }, [backgroundPlayer, gameOverPlayer, clickPlayer, isInitialized, isSoundEnabled]);

    const toggleBackgroundMusic = useCallback(async () => {
        if (isBackgroundMusicPlaying) {
            await stopBackgroundMusic();
        } else {
            await playBackgroundMusic();
        }
    }, [isBackgroundMusicPlaying, playBackgroundMusic, stopBackgroundMusic]);

    const playClickSound = useCallback(async () => {
        if (!isInitialized || !isSoundEnabled) return;

        try {
            await clickPlayer.seekTo(0);
            await clickPlayer.play();
        } catch (error) {
            console.error('Error playing click sound:', error);
        }
    }, [clickPlayer, isInitialized, isSoundEnabled]);

    return {
        isBackgroundMusicPlaying,
        playBackgroundMusic,
        stopBackgroundMusic,
        playGameOverSound,
        stopGameOverSound,
        updateVolume,
        toggleBackgroundMusic,
        playClickSound,
        isSoundEnabled
    };
};