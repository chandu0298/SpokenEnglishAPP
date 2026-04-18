import { Audio } from 'expo-av';
import apiClient from '../api/client';
import * as FileSystem from 'expo-file-system/legacy';

let currentSound: Audio.Sound | null = null;

export async function playHighFidelityTTS(text: string, speed: number = 1.0, accent: string = 'US') {
  try {
    // 1. Force the audio mode to Playback to ensure output comes through speakers
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
    });

    // 2. Stop any existing sound
    if (currentSound) {
      await currentSound.unloadAsync();
      currentSound = null;
    }

    // 3. Define the secure URL and the target temp file
    const audioUrl = `${apiClient.defaults.baseURL}/api/voice/tts?text=${encodeURIComponent(text)}&speed=${speed}&accent=${accent}`;
    const tempUri = `${FileSystem.cacheDirectory}preview.mp3`;

    // 4. Download securely using the latest FileSystem API
    const authToken = apiClient.defaults.headers.common['Authorization'] as string;
    
    // Using the current standard approach
    const downloadResumable = FileSystem.createDownloadResumable(
      audioUrl,
      tempUri,
      {
        headers: {
          'Authorization': authToken
        }
      }
    );

    const result = await downloadResumable.downloadAsync();
    if (!result || result.status !== 200) {
      console.error('Failed to download audio file:', result);
      return;
    }

    // 5. Play the downloaded local file
    const { sound } = await Audio.Sound.createAsync(
      { uri: tempUri },
      { shouldPlay: true }
    );
    currentSound = sound;
    
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        sound.unloadAsync();
        currentSound = null;
      }
    });

  } catch (error) {
    console.error('Error playing TTS:', error);
  }
}
