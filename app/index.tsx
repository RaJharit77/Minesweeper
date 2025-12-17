import { Redirect } from 'expo-router';
import { useEffect } from 'react';
import { Audio } from 'expo-av';
import "../style/global.css";

export default function Index() {
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
  }, []);

  return <Redirect href="/menu" />;
}