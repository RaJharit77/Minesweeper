import { useState, useEffect, useRef } from 'react';
import { Audio } from 'expo-av';
import { useGameStore } from '../store/useSettingsStore';

export const useGameAudio = () => {
    const { volume, isVibrationEnabled } = useGameStore();
    const [isBackgroundMusicPlaying, setIsBackgroundMusicPlaying] = useState(false);
    const backgroundSoundRef = useRef<Audio.Sound | null>(null);
    const gameOverSoundRef = useRef<Audio.Sound | null>(null);

    useEffect(() => {
        const configureAudio = async () => {
            try {
                await Audio.setAudioModeAsync({
                    allowsRecordingIOS: false,
                    playsInSilentModeIOS: true,
                    staysActiveInBackground: false,
                    shouldDuckAndroid: true,
                    playThroughEarpieceAndroid: false,
                });
                console.log('Audio configured successfully');
            } catch (error) {
                console.error('Error configuring audio:', error);
            }
        };

        configureAudio();

        return () => {
            stopBackgroundMusic();
            stopGameOverSound();
        };
    }, []);

    const playBackgroundMusic = async () => {
        try {
            if (backgroundSoundRef.current) {
                await backgroundSoundRef.current.stopAsync();
                await backgroundSoundRef.current.unloadAsync();
                backgroundSoundRef.current = null;
            }

            const { sound } = await Audio.Sound.createAsync(
                require('../../assets/sounds/background.mp3'),
                {
                    isLooping: true,
                    volume: volume * 0.3,
                    shouldPlay: true,
                }
            );

            backgroundSoundRef.current = sound;
            setIsBackgroundMusicPlaying(true);
            console.log('Background music started');
        } catch (error) {
            console.error('Error playing background music:', error);
        }
    };

    const stopBackgroundMusic = async () => {
        try {
            if (backgroundSoundRef.current) {
                await backgroundSoundRef.current.stopAsync();
                await backgroundSoundRef.current.unloadAsync();
                backgroundSoundRef.current = null;
                setIsBackgroundMusicPlaying(false);
                console.log('Background music stopped');
            }
        } catch (error) {
            console.error('Error stopping background music:', error);
        }
    };

    const playGameOverSound = async () => {
        try {
            if (gameOverSoundRef.current) {
                await gameOverSoundRef.current.stopAsync();
                await gameOverSoundRef.current.unloadAsync();
                gameOverSoundRef.current = null;
            }

            await stopBackgroundMusic();

            const { sound } = await Audio.Sound.createAsync(
                require('../../assets/sounds/game_over.mp3'),
                {
                    volume: volume,
                    shouldPlay: true,
                }
            );

            gameOverSoundRef.current = sound;
            console.log('Game over sound played');
        } catch (error) {
            console.error('Error playing game over sound:', error);
        }
    };

    const stopGameOverSound = async () => {
        try {
            if (gameOverSoundRef.current) {
                await gameOverSoundRef.current.stopAsync();
                await gameOverSoundRef.current.unloadAsync();
                gameOverSoundRef.current = null;
                console.log('Game over sound stopped');
            }
        } catch (error) {
            console.error('Error stopping game over sound:', error);
        }
    };

    const updateVolume = async (newVolume: number) => {
        if (backgroundSoundRef.current) {
            await backgroundSoundRef.current.setVolumeAsync(newVolume * 0.3);
        }
    };

    const toggleBackgroundMusic = async () => {
        if (isBackgroundMusicPlaying) {
            await stopBackgroundMusic();
        } else {
            await playBackgroundMusic();
        }
    };

    return {
        isBackgroundMusicPlaying,
        playBackgroundMusic,
        stopBackgroundMusic,
        playGameOverSound,
        stopGameOverSound,
        updateVolume,
        toggleBackgroundMusic,
    };
};