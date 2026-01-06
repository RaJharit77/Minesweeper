import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useGameAudio } from '../hooks/useGameAudio';

export const SoundControl = () => {
    const { isBackgroundMusicPlaying, toggleBackgroundMusic } = useGameAudio();

    return (
        <TouchableOpacity
            className="absolute top-16 right-5 bg-gray-800 p-3 rounded-lg flex-row items-center"
            onPress={toggleBackgroundMusic}
        >
            <Ionicons
                name={isBackgroundMusicPlaying ? "volume-high" : "volume-mute"}
                size={24}
                color="#1bb5fc"
            />
            <Text className="text-blue-400 ml-2 text-sm font-medium">
                {isBackgroundMusicPlaying ? 'Musique ON' : 'Musique OFF'}
            </Text>
        </TouchableOpacity>
    );
};