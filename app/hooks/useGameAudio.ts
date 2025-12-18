import { useState, useEffect, useCallback } from 'react';
import { useAudioPlayer, AudioModule } from 'expo-audio';
import { useGameStore } from '../store/useSettingsStore';

export const useGameAudio = () => {
    const { volume, isVibrationEnabled } = useGameStore();
    const [isBackgroundMusicPlaying, setIsBackgroundMusicPlaying] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    const backgroundPlayer = useAudioPlayer(
        require('../../assets/sounds/background.mp3'),
        {

        }
    );

    const gameOverPlayer = useAudioPlayer(
        require('../../assets/sounds/game_over.mp3'),
        {

        }
    );

    const clickPlayer = useAudioPlayer(
        require('../../assets/sounds/click.mp3'),
        {

        }
    );

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
            // Correction : utiliser pause() au lieu de stop()
            backgroundPlayer.pause();
            gameOverPlayer.pause();
            clickPlayer.pause();
        };
    }, []);

    const playBackgroundMusic = useCallback(async () => {
        if (!isInitialized) return;

        try {
            await backgroundPlayer.play();
            setIsBackgroundMusicPlaying(true);
            console.log('Background music started (covers game sounds)');
        } catch (error) {
            console.error('Error playing background music:', error);
        }
    }, [backgroundPlayer, isInitialized]);

    const stopBackgroundMusic = useCallback(async () => {
        if (!isInitialized) return;

        try {
            // Correction : utiliser pause() au lieu de stop()
            await backgroundPlayer.pause();
            setIsBackgroundMusicPlaying(false);
            console.log('Background music stopped');
        } catch (error) {
            console.error('Error stopping background music:', error);
        }
    }, [backgroundPlayer, isInitialized]);

    const playGameOverSound = useCallback(async () => {
        if (!isInitialized) return;

        try {
            await stopBackgroundMusic();

            await gameOverPlayer.play();
            console.log('Game over sound played');

            setTimeout(async () => {
                // Correction : utiliser pause() au lieu de stop()
                await gameOverPlayer.pause();
            }, 3000);
        } catch (error) {
            console.error('Error playing game over sound:', error);
        }
    }, [gameOverPlayer, stopBackgroundMusic, isInitialized]);

    const stopGameOverSound = useCallback(async () => {
        if (!isInitialized) return;

        try {
            // Correction : utiliser pause() au lieu de stop()
            await gameOverPlayer.pause();
            console.log('Game over sound stopped');
        } catch (error) {
            console.error('Error stopping game over sound:', error);
        }
    }, [gameOverPlayer, isInitialized]);

    const updateVolume = useCallback(async (newVolume: number) => {
        if (!isInitialized) return;

        try {
            // Correction : volume est une propriété mutable, pas une méthode setVolume
            backgroundPlayer.volume = newVolume * 0.5;
            gameOverPlayer.volume = newVolume * 0.7;
            clickPlayer.volume = newVolume * 0.3;
        } catch (error) {
            console.error('Error updating volume:', error);
        }
    }, [backgroundPlayer, gameOverPlayer, clickPlayer, isInitialized]);

    const toggleBackgroundMusic = useCallback(async () => {
        if (isBackgroundMusicPlaying) {
            await stopBackgroundMusic();
        } else {
            await playBackgroundMusic();
        }
    }, [isBackgroundMusicPlaying, playBackgroundMusic, stopBackgroundMusic]);

    const playClickSound = useCallback(async () => {
        if (!isInitialized) return;

        try {
            await clickPlayer.seekTo(0);
            await clickPlayer.play();
        } catch (error) {
            console.error('Error playing click sound:', error);
        }
    }, [clickPlayer, isInitialized]);

    return {
        isBackgroundMusicPlaying,
        playBackgroundMusic,
        stopBackgroundMusic,
        playGameOverSound,
        stopGameOverSound,
        updateVolume,
        toggleBackgroundMusic,
        playClickSound,
    };
};