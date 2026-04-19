import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  KeyboardAvoidingView, 
  Platform, 
  ActivityIndicator, 
  Image,
  Dimensions,
  SafeAreaView
} from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { Colors, Spacing, Typography, Radius } from '../../constants/Theme';
import apiClient from '../../api/client';
import * as Speech from 'expo-speech';
import { Ionicons } from '@expo/vector-icons';
import { Waveform } from '../../components/Voice/Waveform';
import { useVoiceRecorder } from '../../hooks/useVoiceRecorder';
import { transcribeAudio } from '../../api/stt';

const { width } = Dimensions.get('window');
const COACH_AVATAR = require('../../assets/images/coach_priya.png');

interface ChatMessage {
  id?: string;
  role: 'user' | 'coach';
  text: string;
  tips?: string[];
  originalQuery?: string;
}

export default function ChatScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'coach',
      text: "Hi! I'm Coach Priya. Let's practice your English speaking today. What's on your mind?",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'voice' | 'text'>('text');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentSpeakingId, setCurrentSpeakingId] = useState<string | null>(null);
  const { isRecording, startRecording, stopRecording } = useVoiceRecorder();
  const flatListRef = useRef<FlatList>(null);

  async function sendMessage(textOverride?: string) {
    const messageText = textOverride || input.trim();
    if (!messageText || loading) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: messageText }]);
    setLoading(true);

    try {
      const response = await apiClient.post('/api/chat/message', {
        message: messageText,
        user_level: 'B1', 
      });

      const coachReply = response.data.coach_reply;
      const tips = response.data.grammar_tips?.map((t: any) => t.suggestion || t.correction) || [];

      setMessages(prev => [...prev, {
        role: 'coach',
        text: coachReply,
        tips: tips.length > 0 ? tips : undefined,
        originalQuery: messageText
      }]);

    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'coach',
        text: '⚠️ Connection issue. Let me try again in a moment.',
      }]);
    } finally {
      setLoading(false);
    }
  }

  async function regenerateResponse(originalQuery: string) {
    if (!originalQuery || loading) return;
    
    setLoading(true);
    const tempId = Date.now().toString();
    setMessages(prev => [...prev, { 
      role: 'coach', 
      text: 'Thinking of a different way to explain...', 
      id: tempId 
    }]);

    try {
      const response = await apiClient.post('/api/chat/message', {
        message: `I didn't quite get that. Can you explain "${originalQuery}" differently with a new, different example?`,
        user_level: 'B1', 
      });

      const coachReply = response.data.coach_reply;
      setMessages(prev => {
        const filtered = prev.filter(m => m.id !== tempId);
        return [...filtered, {
          role: 'coach',
          text: coachReply,
          originalQuery: originalQuery
        }];
      });

    } catch (err) {
      setMessages(prev => [...prev.filter(m => m.id !== tempId), {
        role: 'coach',
        text: '⚠️ Still having trouble connecting. Let me try once more.',
      }]);
    } finally {
      setLoading(false);
    }
  }

  async function handleAudioMessage(uri: string) {
    setLoading(true);
    try {
      const result = await transcribeAudio(uri);
      if (result && result.text) {
        sendMessage(result.text);
      }
    } catch (err) {
      console.error('Audio processing failed', err);
    } finally {
      setLoading(false);
    }
  }

  const handlePlayback = (text: string, messageId: string, rate: number = 0.9) => {
    // If muted, don't play audio
    if (isMuted) return;
    
    // If already speaking the same message, toggle pause/resume
    if (currentSpeakingId === messageId && isSpeaking) {
      if (isPaused) {
        Speech.resume();
        setIsPaused(false);
      } else {
        Speech.pause();
        setIsPaused(true);
      }
      return;
    }
    
    // Stop any current speech and start new
    Speech.stop();
    setCurrentSpeakingId(messageId);
    setIsSpeaking(true);
    setIsPaused(false);
    
    Speech.speak(text, { 
      language: 'en-US', 
      rate,
      onDone: () => {
        setIsSpeaking(false);
        setIsPaused(false);
        setCurrentSpeakingId(null);
      },
      onStopped: () => {
        setIsSpeaking(false);
        setIsPaused(false);
        setCurrentSpeakingId(null);
      }
    });
  };

  const handlePause = () => {
    if (isSpeaking && !isPaused) {
      Speech.pause();
      setIsPaused(true);
    } else if (isSpeaking && isPaused) {
      Speech.resume();
      setIsPaused(false);
    }
  };

  const handleStop = () => {
    Speech.stop();
    setIsSpeaking(false);
    setIsPaused(false);
    setCurrentSpeakingId(null);
  };

  const toggleMute = () => {
    if (!isMuted && isSpeaking) {
      // If turning on mute while speaking, stop the speech
      Speech.stop();
      setIsSpeaking(false);
      setIsPaused(false);
      setCurrentSpeakingId(null);
    }
    setIsMuted(!isMuted);
  };

  function renderMessage({ item, index }: { item: ChatMessage; index: number }) {
    const isCoach = item.role === 'coach';
    const messageId = item.id || `msg-${index}`;
    const isCurrentlySpeaking = currentSpeakingId === messageId && isSpeaking;
    
    return (
      <View style={{ marginBottom: Spacing.md }}>
        <View style={[styles.messageRow, !isCoach && { justifyContent: 'flex-end' }]}>
          {isCoach && (
            <Image source={COACH_AVATAR} style={styles.bubbleAvatar} />
          )}
          <View style={[styles.bubble, isCoach ? styles.coachBubble : styles.userBubble]}>
            <Text style={[styles.bubbleText, !isCoach && { color: '#FFF' }]}>{item.text}</Text>
            
            {isCoach && (
              <View style={styles.coachControls}>
                {/* Audio Controls Group */}
                <View style={styles.audioControlsGroup}>
                  {/* Mute Toggle */}
                  <TouchableOpacity 
                    onPress={toggleMute} 
                    style={[styles.controlBtn, isMuted && styles.mutedBtn]}
                  >
                    <Ionicons 
                      name={isMuted ? "volume-mute" : "volume-medium"} 
                      size={24} 
                      color={isMuted ? Colors.textSecondary : Colors.primary} 
                    />
                  </TouchableOpacity>
                  
                  {/* Play/Pause Button */}
                  {!isMuted && (
                    <TouchableOpacity 
                      onPress={() => handlePlayback(item.text, messageId)} 
                      style={[styles.controlBtn, isCurrentlySpeaking && styles.activeControlBtn]}
                    >
                      <Ionicons 
                        name={isCurrentlySpeaking && !isPaused ? "pause" : "play"} 
                        size={22} 
                        color={Colors.primary} 
                      />
                    </TouchableOpacity>
                  )}
                  
                  {/* Stop Button - only show when speaking this message */}
                  {isCurrentlySpeaking && !isMuted && (
                    <TouchableOpacity 
                      onPress={handleStop} 
                      style={styles.controlBtn}
                    >
                      <Ionicons 
                        name="stop" 
                        size={20} 
                        color="#EF4444" 
                      />
                    </TouchableOpacity>
                  )}
                </View>
                
                <TouchableOpacity 
                   onPress={() => regenerateResponse(item.originalQuery || messages[messages.indexOf(item)-1]?.text || '')} 
                   style={styles.explainBtn}
                >
                  <Ionicons name="refresh-circle-outline" size={20} color={Colors.primary} />
                  <Text style={styles.explainText}>Try understand differently</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
         <Image source={COACH_AVATAR} style={styles.headerAvatar} />
         <View>
            <Text style={Typography.h3}>Coach Priya</Text>
            <View style={styles.statusRow}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>AI Mentor Online</Text>
            </View>
         </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(_, i) => i.toString()}
        contentContainerStyle={{ padding: Spacing.md, paddingBottom: 120 }}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        style={styles.bottomArea}
      >
        <View style={mode === 'voice' ? styles.visibleWave : styles.hiddenWave}>
          <Waveform isRecording={isRecording} />
        </View>

        <View style={styles.interactionContainer}>
          <TouchableOpacity 
            style={[styles.modeToggle, mode === 'voice' && styles.activeMode]}
            onPress={() => setMode(mode === 'text' ? 'voice' : 'text')}
          >
            <Ionicons 
              name={mode === 'text' ? "mic-outline" : "text-outline"} 
              size={24} 
              color={mode === 'voice' ? Colors.primary : Colors.textSecondary} 
            />
          </TouchableOpacity>

          {mode === 'text' ? (
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.textInput}
                placeholder="Message Coach Priya..."
                placeholderTextColor={Colors.textSecondary}
                value={input}
                onChangeText={setInput}
                multiline
                autoFocus
              />
              <TouchableOpacity 
                style={[styles.sendBtn, !input.trim() && { opacity: 0.5 }]}
                onPress={() => sendMessage()}
                disabled={!input.trim() || loading}
              >
                <Ionicons name="send" size={20} color="#FFF" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity 
              style={[styles.mainMicBtn, isRecording && styles.micBtnActive]}
              onPress={isRecording ? async () => {
                const uri = await stopRecording();
                if (uri) handleAudioMessage(uri);
              } : startRecording}
            >
              <Ionicons name={isRecording ? "stop" : "mic"} size={24} color="#FFF" />
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.keyboardToggle}>
            <Ionicons name="settings-outline" size={24} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>
        
        <View style={{ height: 16 }} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
     padding: Spacing.md,
     backgroundColor: Colors.surface,
     borderBottomWidth: 1,
     borderBottomColor: Colors.border,
     flexDirection: 'row',
     alignItems: 'center',
  },
  headerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: Spacing.sm,
    borderWidth: 1.5,
    borderColor: Colors.primary + '30',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  statusText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bubbleAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    marginTop: 4,
  },
  bubble: {
    borderRadius: 20,
    padding: Spacing.md,
    maxWidth: '82%',
  },
  coachBubble: {
    backgroundColor: Colors.surface,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  userBubble: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
  },
  bubbleText: {
    fontSize: 16,
    color: Colors.text,
    lineHeight: 24,
  },
  coachControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 12,
    flexWrap: 'wrap',
    gap: 8,
  },
  audioControlsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 20,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  controlBtn: {
    padding: 6,
    borderRadius: 16,
  },
  activeControlBtn: {
    backgroundColor: Colors.primary + '15',
  },
  mutedBtn: {
    opacity: 0.6,
  },
  explainBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary + '10',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginLeft: 12,
    borderWidth: 1,
    borderColor: Colors.primary + '20',
  },
  explainText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
    marginLeft: 4,
  },
  bottomArea: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: Colors.surface,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 20,
  },
  interactionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: 5,
  },
  mainMicBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  micBtnActive: {
    backgroundColor: '#EF4444',
  },
  keyboardToggle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  visibleWave: {
    opacity: 1,
    height: 48,
  },
  hiddenWave: {
    opacity: 0,
    height: 0,
    overflow: 'hidden',
  },
  modeToggle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeMode: {
    backgroundColor: Colors.primary + '10',
    borderWidth: 1,
    borderColor: Colors.primary + '30',
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 24,
    paddingHorizontal: 12,
    marginHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  textInput: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    fontSize: 16,
    color: Colors.text,
    maxHeight: 100,
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  }
});
