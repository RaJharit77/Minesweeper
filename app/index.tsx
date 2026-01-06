import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { AudioModule } from 'expo-audio';
import { sqliteService } from '../app/service/sqliteService';
import { View, ActivityIndicator } from 'react-native';
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
        console.log('Audio configured successfully with expo-audio');

        await sqliteService.initialize();
        console.log('SQLite database initialized');

        setIsInitialized(true);
      } catch (error) {
        console.error('Error initializing app:', error);
        setIsInitialized(true);
      }
    };

    initializeApp();

    return () => {
      sqliteService.close();
    };
  }, []);

  if (!isInitialized) {
    return (
      <View className="flex-1 bg-gray-900 justify-center items-center">
        <ActivityIndicator size="large" color="#1bb5fc" />
      </View>
    );
  }

  return <Redirect href="/menu" />;
}