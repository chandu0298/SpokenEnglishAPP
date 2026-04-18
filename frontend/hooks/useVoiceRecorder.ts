import { useState, useRef, useEffect } from 'react';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';

export function useVoiceRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const recordingRef = useRef<Audio.Recording | null>(null);

  useEffect(() => {
    return () => {
      // Cleanup: ensure recording is stopped if component unmounts
      if (recordingRef.current) {
        stopRecording();
      }
    };
  }, []);

  async function startRecording() {
    try {
      if (permissionResponse?.status !== 'granted') {
        console.log('Requesting permissions..');
        await requestPermission();
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log('Starting recording..');
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      recordingRef.current = recording;
      setIsRecording(true);
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording(): Promise<string | null> {
    console.log('Stopping recording..');
    if (!recordingRef.current) return null;

    setIsRecording(false);
    try {
      await recordingRef.current.stopAndUnloadAsync();
      
      // CRITICAL: Reset the audio mode to allow playback through speakers
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });

      const uri = recordingRef.current.getURI();
      console.log('Recording stopped and stored at', uri);
      setRecordingUri(uri);
      recordingRef.current = null;
      return uri;
    } catch (err) {
      console.error('Failed to stop recording', err);
      return null;
    }
  }

  return {
    isRecording,
    recordingUri,
    startRecording,
    stopRecording,
  };
}
