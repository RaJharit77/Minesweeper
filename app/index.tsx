import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { AudioModule } from 'expo-audio';
import { View, ActivityIndicator, Text } from 'react-native';
import "../style/global.css";

export default function Index() {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await AudioModule.setAudioModeAsync({
          allowsRecording: false,
          playsInSilentMode: true,
        });

        setIsInitialized(true);

      } catch (error) {
        console.error('❌ Error initializing app:', error);
        setIsInitialized(true);
      }
    };

    initializeApp();
  }, []);

  if (!isInitialized) {
    return (
      <View className="flex-1 bg-gray-900 justify-center items-center">
        <ActivityIndicator size="large" color="#1bb5fc" />
        <Text className="text-blue-400 mt-4">Initialisation de l'application...</Text>
      </View>
    );
  }

  return <Redirect href="/menu" />;
}