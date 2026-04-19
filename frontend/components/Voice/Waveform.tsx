import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../../constants/Theme';

interface WaveformProps {
  isRecording: boolean;
}

const BAR_COUNT = 8;

export const Waveform: React.FC<WaveformProps> = ({ isRecording }) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: BAR_COUNT }).map((_, i) => (
        <View 
          key={i} 
          style={[
            styles.bar, 
            { 
              height: isRecording ? 20 + (i * 8) % 40 : 12,
              opacity: isRecording ? 1 : 0.4 
            }
          ]} 
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 100,
  },
  bar: {
    width: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
  },
});
