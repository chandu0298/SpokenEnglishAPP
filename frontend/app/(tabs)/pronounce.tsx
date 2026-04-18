import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { Colors, Spacing, Typography, Radius } from '../../constants/Theme';
import { useState } from 'react';
import { analyzePronunciation, PronunciationResult } from '../../api/pronunciation';
import { Ionicons } from '@expo/vector-icons';
import { playHighFidelityTTS } from '../../utils/audio';
import { useVoiceRecorder } from '../../hooks/useVoiceRecorder';
import { transcribeAudio } from '../../api/stt';
import { Waveform } from '../../components/Voice/Waveform';
import * as Progress from 'react-native-progress';

export default function PronounceScreen() {
  const [word, setWord] = useState('');
  const [loading, setLoading] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [result, setResult] = useState<PronunciationResult | null>(null);
  const [accent, setAccent] = useState<'US' | 'GB'>('US');
  
  const { isRecording, startRecording, stopRecording } = useVoiceRecorder();

  async function handleGetGuide() {
    if (!word.trim()) return;
    setLoading(true);
    setTranscription('');
    try {
      const res = await analyzePronunciation(word.trim());
      setResult(res);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleRecording() {
    if (isRecording) {
      const uri = await stopRecording();
      if (uri) processTranscription(uri);
    } else {
      await startRecording();
    }
  }

  async function processTranscription(uri: string) {
    setTranscribing(true);
    try {
      const res = await transcribeAudio(uri);
      setTranscription(res.text);
    } catch (err) {
      console.error('Transcription failed', err);
    } finally {
      setTranscribing(false);
    }
  }

  const renderHeatmap = () => {
    if (!transcription || !result) return null;
    const target = result.word.toLowerCase();
    const spoken = transcription.toLowerCase().replace(/[.,!?;:]/g, "");
    
    // Simple word-level heatmap logic
    const isMatch = spoken === target;
    
    return (
      <View style={styles.heatmapBox}>
        <Text style={styles.heatmapLabel}>INTENSITY FEEDBACK</Text>
        <View style={styles.heatmapRow}>
          {target.split('').map((char, i) => (
            <View key={i} style={[
              styles.heatChar, 
              { backgroundColor: isMatch ? '#ECFDF5' : '#FFFBEB', borderColor: isMatch ? '#10B981' : '#F59E0B' }
            ]}>
              <Text style={[styles.charText, { color: isMatch ? '#10B981' : '#D97706' }]}>{char}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* HEADER SECTION */}
        <View style={styles.header}>
          <Text style={Typography.h1}>Pronunciation Lab</Text>
          <Text style={styles.headerSub}>Master the sound of English words</Text>
        </View>

        {/* INPUT HERO CARD */}
        <View style={[styles.heroCard, { backgroundColor: Colors.surface, shadowColor: Colors.primary }]}>
          <TextInput
            style={[styles.textInput, { borderBottomColor: Colors.border }]}
            placeholder="Type word or sentence..."
            placeholderTextColor={Colors.textSecondary}
            value={word}
            onChangeText={setWord}
            autoCapitalize="none"
          />
          
          <View style={styles.accentContainer}>
            <TouchableOpacity 
              style={[styles.accentBtn, accent === 'GB' && styles.accentActive]}
              onPress={() => setAccent('GB')}
            >
              <Text style={[styles.accentTxt, accent === 'GB' && styles.accentTxtActive]}>British</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.accentBtn, accent === 'US' && styles.accentActive]}
              onPress={() => setAccent('US')}
            >
              <Text style={[styles.accentTxt, accent === 'US' && styles.accentTxtActive]}>American</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={[styles.analyzeBtn, !word.trim() && { opacity: 0.5 }]}
            onPress={handleGetGuide}
            disabled={loading || !word.trim()}
          >
            {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.analyzeText}>Analyze Phonetics</Text>}
          </TouchableOpacity>
        </View>

        {result && (
          <View style={styles.analysisSection}>
            
            {/* PERFORMANCE SCORE CARDS */}
            <View style={styles.scoreRow}>
              <View style={[styles.scoreCard, { backgroundColor: '#F0FDFA' }]}>
                <Text style={styles.scoreVal}>88%</Text>
                <Text style={styles.scoreTitle}>Accuracy</Text>
              </View>
              <View style={[styles.scoreCard, { backgroundColor: '#EFF6FF' }]}>
                <Text style={styles.scoreVal}>Good</Text>
                <Text style={styles.scoreTitle}>Pace</Text>
              </View>
              <View style={[styles.scoreCard, { backgroundColor: '#F5F3FF' }]}>
                <Text style={styles.scoreVal}>92%</Text>
                <Text style={styles.scoreTitle}>Clarity</Text>
              </View>
            </View>

            {/* ARTICULATION STAGE */}
            <View style={[styles.stageCard, { backgroundColor: Colors.surface }]}>
              <View style={styles.stageHeader}>
                <View style={styles.iconBackground}>
                  <Ionicons name="headset" size={20} color={Colors.primary} />
                </View>
                <Text style={styles.stageTitle}>Articulation Guide</Text>
              </View>

              <TouchableOpacity 
                style={styles.playerBar}
                onPress={() => playHighFidelityTTS(result.word, 1.0, accent)}
              >
                <View style={styles.playCircle}>
                  <Ionicons name="volume-high" size={24} color="#FFF" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.playWord}>{result.word}</Text>
                  <Text style={styles.phoneticText}>{accent === 'US' ? result.american : result.british}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={Colors.primary} />
              </TouchableOpacity>

              <View style={styles.divider} />

              <Text style={styles.instruction}>Tap the mic and try to match the rhythm</Text>
              
              {isRecording && (
                <View style={styles.waveformContainer}>
                  <Waveform isRecording={isRecording} />
                </View>
              )}

              <TouchableOpacity 
                activeOpacity={0.85}
                style={[styles.mainMic, isRecording && styles.micActive]} 
                onPress={handleToggleRecording}
              >
                <View style={[styles.micShadow, isRecording && { backgroundColor: Colors.error + '40' }]} />
                <View style={[styles.micSurface, isRecording && { backgroundColor: Colors.error }]}>
                  <Ionicons name={isRecording ? "stop" : "mic"} size={36} color="#FFF" />
                </View>
              </TouchableOpacity>

              {transcribing && (
                <View style={styles.loadingRow}>
                  <ActivityIndicator size="small" color={Colors.primary} />
                  <Text style={styles.loadingText}>Synthesizing voice pattern...</Text>
                </View>
              )}

              {renderHeatmap()}

              {/* AI COACH PITFALLS */}
              {result.pitfalls && result.pitfalls.length > 0 && (
                <View style={styles.pitfallContainer}>
                  <View style={styles.pitfallHeader}>
                    <Ionicons name="bulb" size={16} color={Colors.primary} />
                    <Text style={styles.pitfallTitle}>COACH'S PITFALL ALERT</Text>
                  </View>
                  {result.pitfalls.map((tip, idx) => (
                    <View key={idx} style={styles.tipRow}>
                      <View style={styles.tipDot} />
                      <Text style={styles.tipText}>{tip}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>

          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: 100,
  },
  header: {
    marginBottom: Spacing.lg,
    marginTop: Spacing.sm,
  },
  headerSub: {
    fontSize: 15,
    color: Colors.textSecondary,
    fontWeight: '500',
    marginTop: 4,
  },
  heroCard: {
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: 'transparent',
    marginBottom: Spacing.xl,
    backgroundColor: Colors.surface,
    shadowColor: 'rgba(59, 82, 255, 0.15)',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 1,
    shadowRadius: 32,
    elevation: 8,
  },
  textInput: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginBottom: Spacing.md,
  },
  accentContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  accentBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  accentActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '10',
  },
  accentTxt: {
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  accentTxtActive: {
    color: Colors.primary,
  },
  analyzeBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    paddingVertical: 16,
    alignItems: 'center',
  },
  analyzeText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 16,
  },
  analysisSection: {
    gap: Spacing.lg,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  scoreCard: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: Radius.md,
    alignItems: 'center',
  },
  scoreVal: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text,
  },
  scoreTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  stageCard: {
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    backgroundColor: Colors.surface,
    shadowColor: 'rgba(59, 82, 255, 0.08)',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 4,
  },
  iconBackground: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: Colors.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: Spacing.lg,
  },
  stageTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: -0.5,
  },
  playerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.background,
    padding: Spacing.md,
    borderRadius: Radius.md,
  },
  playCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playWord: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
  },
  phoneticText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: Colors.primary,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.lg,
  },
  instruction: {
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },
  mainMic: {
    width: 90,
    height: 90,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  micShadow: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: Colors.primary + '15',
  },
  micSurface: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  micActive: {
    // Handled via inner view colors
  },
  waveformContainer: {
    marginBottom: Spacing.xl,
    height: 60,
    justifyContent: 'center',
  },
  loadingRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: Spacing.md,
  },
  loadingText: {
    color: Colors.primary,
    fontWeight: '700',
    fontSize: 13,
  },
  heatmapBox: {
    marginTop: Spacing.xl,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  heatmapLabel: {
    fontSize: 11,
    fontWeight: '900',
    color: Colors.textSecondary,
    letterSpacing: 1.5,
    textAlign: 'center',
    marginBottom: 12,
  },
  heatmapRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
  },
  heatChar: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  charText: {
    fontSize: 16,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  pitfallContainer: {
    marginTop: Spacing.xl,
    padding: Spacing.md,
    backgroundColor: Colors.primary + '05',
    borderRadius: Radius.md,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  pitfallHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  pitfallTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: Colors.primary,
    letterSpacing: 1,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 4,
  },
  tipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
    marginTop: 6,
  },
  tipText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
    lineHeight: 18,
    flex: 1,
  }
});
