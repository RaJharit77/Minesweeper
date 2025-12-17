import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { RestartButtonProps } from '../types/interfaces/RestartButtonProps';

const RestartButton: React.FC<RestartButtonProps> = ({ onPress }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            className="bg-blue-400 py-4 px-6 rounded-lg"
        >
            <Text className="text-white text-center text-base font-medium">
                Recommencer
            </Text>
        </TouchableOpacity>
    );
};

export default RestartButton;