import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { AudioModule } from 'expo-audio';
import { sqliteService } from '../app/service/sqliteService';
import { View, ActivityIndicator, Text } from 'react-native';
import "../style/global.css";

export default function Index() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('Starting app initialization...');

        await AudioModule.setAudioModeAsync({
          allowsRecording: false,
          playsInSilentMode: true,
        });
        console.log('✅ Audio configured successfully');

        await Promise.race([
          sqliteService.initialize(),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('SQLite initialization timeout')), 5000)
          )
        ]);

        console.log('✅ SQLite database initialized');
        setIsInitialized(true);

      } catch (error) {
        console.error('❌ Error initializing app:', error);
        setError(error instanceof Error ? error.message : 'Unknown error');
        setIsInitialized(true);
      }
    };

    initializeApp();

    return () => {
      console.log('App cleanup');
    };
  }, []);

  if (!isInitialized) {
    return (
      <View className="flex-1 bg-gray-900 justify-center items-center">
        <ActivityIndicator size="large" color="#1bb5fc" />
        <Text className="text-blue-400 mt-4">Initialisation de l'application...</Text>
        {error && (
          <Text className="text-red-400 mt-2 text-center px-5">
            Erreur: {error}
          </Text>
        )}
      </View>
    );
  }

  return <Redirect href="/menu" />;
}