import { Redirect } from 'expo-router';
import { useEffect } from 'react';
import { AudioModule } from 'expo-audio';
import "../style/global.css";

export default function Index() {
  useEffect(() => {
    const configureAudio = async () => {
      try {
        await AudioModule.setAudioModeAsync({
          allowsRecording: false,
          playsInSilentMode: true,
        });
        console.log('Audio configured successfully with expo-audio');
      } catch (error) {
        console.error('Error configuring audio:', error);
      }
    };

    configureAudio();
  }, []);

  return <Redirect href="/menu" />;
}