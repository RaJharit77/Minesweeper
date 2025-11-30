import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

interface RestartButtonProps {
    onPress: () => void;
}

const RestartButton: React.FC<RestartButtonProps> = ({ onPress }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={{
                backgroundColor: '#1bb5fc',
                padding: 15,
                borderRadius: 5,
                marginTop: 20,
            }}
        >
            <Text style={{ color: 'white', textAlign: 'center' }}>Recommencer</Text>
        </TouchableOpacity>
    );
};

export default RestartButton;