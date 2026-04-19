import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useState, useRef } from 'react';
import { Colors, Spacing, Typography, Radius } from '../../constants/Theme';
import { Stack } from 'expo-router';
import apiClient from '../../api/client';
import * as Speech from 'expo-speech';
import { Ionicons } from '@expo/vector-icons';

interface ChatMessage {
  role: 'user' | 'coach';
  text: string;
  tips?: string[];
}

export default function PracticeScreen() {
  const { title, desc, level, phrases, exampleA, exampleB } = useLocalSearchParams<{
    title: string;
    desc: string;
    level: string;
    phrases: string;
    exampleA: string;
    exampleB: string;
  }>();

  const parsedPhrases = phrases ? JSON.parse(phrases) : [];
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'coach',
      text: `Hi! I'm Coach Priya. Let's practice "${title}" together! 🎯\n\nI'll play the other person in this scenario. Try to use phrases like:\n${parsedPhrases.slice(0, 3).map((p: string) => `• ${p}`).join('\n')}\n\nLet's begin! ${exampleA || 'Go ahead and start the conversation.'}`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [turnCount, setTurnCount] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const response = await apiClient.post('/api/chat/message', {
        message: `[ROLEPLAY CONTEXT: We are practicing "${title}" - ${desc}. Level: ${level}. Key phrases to encourage: ${parsedPhrases.join(', ')}. Turn ${turnCount + 1} of the roleplay.]\n\nUser says: ${userMsg}`,
        user_level: level || 'B1',
      });

      const coachReply = response.data.coach_reply;
      const tips = response.data.grammar_tips?.map((t: any) => t.suggestion || t.correction) || [];

      setMessages(prev => [...prev, {
        role: 'coach',
        text: coachReply,
        tips: tips.length > 0 ? tips : undefined,
      }]);

      // Speak Coach Priya's reply
      Speech.speak(coachReply, { language: 'en-US', rate: 0.9 });

      setTurnCount(prev => prev + 1);

      // After 5 turns, show completion
      if (turnCount >= 4) {
        setTimeout(() => {
          setMessages(prev => [...prev, {
            role: 'coach',
            text: `🎉 Amazing work! You've completed the "${title}" scenario!\n\nYou practiced ${turnCount + 1} exchanges. Keep going to improve your fluency!\n\nTip: Try this lesson again and use different phrases each time.`,
          }]);
        }, 2000);
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'coach',
        text: '⚠️ Could not reach Coach Priya. Please check your backend is running.',
      }]);
    } finally {
      setLoading(false);
    }
  }

  function renderMessage({ item }: { item: ChatMessage }) {
    const isCoach = item.role === 'coach';
    return (
      <View style={{ marginBottom: Spacing.md, alignItems: isCoach ? 'flex-start' : 'flex-end' }}>
        <View style={[
          styles.bubble, 
          isCoach ? styles.coachBubble : styles.userBubble,
          { shadowColor: isCoach ? Colors.primary : 'rgba(0,0,0,0.1)' }
        ]}>
          <Text style={[styles.bubbleText, !isCoach && { color: '#FFF' }]}>{item.text}</Text>
        </View>
        {item.tips && item.tips.length > 0 && (
          <View style={styles.tipsContainer}>
            {item.tips.map((tip, i) => (
              <View key={i} style={styles.tipPill}>
                <Ionicons name="sparkles" size={12} color={Colors.accent} />
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: `Practice: ${title}` }} />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={90}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(_, i) => i.toString()}
          contentContainerStyle={{ padding: Spacing.md, paddingBottom: 20 }}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        <View style={styles.inputBar}>
          <TextInput
            style={styles.textInput}
            placeholder="Type your response..."
            placeholderTextColor={Colors.textSecondary}
            value={input}
            onChangeText={setInput}
            onSubmitEditing={sendMessage}
            returnKeyType="send"
            editable={!loading}
          />
          <TouchableOpacity
            style={[styles.sendBtn, (!input.trim() || loading) && { opacity: 0.4 }]}
            onPress={sendMessage}
            disabled={!input.trim() || loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color={Colors.surface} />
            ) : (
              <Text style={styles.sendText}>Send</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  bubble: {
    padding: Spacing.md,
    paddingHorizontal: Spacing.lg,
    maxWidth: '85%',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  coachBubble: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 4,
    borderTopRightRadius: Radius.lg,
    borderBottomRightRadius: Radius.lg,
    borderBottomLeftRadius: Radius.lg,
    alignSelf: 'flex-start',
  },
  userBubble: {
    backgroundColor: Colors.primary,
    borderTopLeftRadius: Radius.lg,
    borderTopRightRadius: 4,
    borderBottomRightRadius: Radius.lg,
    borderBottomLeftRadius: Radius.lg,
    alignSelf: 'flex-end',
  },
  bubbleText: {
    fontSize: 16,
    color: Colors.text,
    lineHeight: 24,
    fontWeight: '500',
  },
  tipsContainer: {
    marginTop: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    paddingHorizontal: 4,
  },
  tipPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accent + '15',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.md,
    gap: 6,
  },
  tipText: {
    fontSize: 12,
    color: Colors.accent,
    fontWeight: '700',
  },
  inputBar: {
    flexDirection: 'row',
    padding: Spacing.md,
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderColor: 'transparent',
    alignItems: 'center',
    shadowColor: 'rgba(0,0,0,0.1)',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 8,
  },
  textInput: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.text,
    marginRight: Spacing.md,
    fontWeight: '500',
  },
  sendBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
  },
  sendText: {
    color: Colors.surface,
    fontWeight: '700',
    fontSize: 15,
  },
});
