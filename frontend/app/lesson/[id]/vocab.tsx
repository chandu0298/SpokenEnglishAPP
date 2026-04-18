import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState, useRef } from 'react';
import { fetchLessonDetail, LessonDetail } from '../../../api/lessons';
import { Colors, Spacing, Typography } from '../../../constants/Theme';
import { Stack, useRouter } from 'expo-router';
import * as Speech from 'expo-speech';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - Spacing.md * 2;

export default function LessonDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  function speakPhrase(phrase: string, index: number) {
    Speech.stop();
    setSpeakingIndex(index);
    Speech.speak(phrase, {
      language: 'en-US',
      rate: 0.85,
      onDone: () => setSpeakingIndex(null),
      onStopped: () => setSpeakingIndex(null),
    });
  }

  function handleNext() {
    if (lesson && currentPhraseIndex < lesson.phrases.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentPhraseIndex + 1, animated: true });
      setCurrentPhraseIndex(currentPhraseIndex + 1);
    }
  }

  useEffect(() => {
    if (id) {
      fetchLessonDetail(Number(id))
        .then(setLesson)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!lesson) {
    return (
      <View style={styles.center}>
        <Text style={Typography.body}>Lesson not found</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Phase 1: Vocabulary' }} />
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Scenario Brief */}
        <View style={styles.briefCard}>
          <Text style={styles.briefLabel}>SCENARIO BRIEF</Text>
          <Text style={styles.briefTitle}>{lesson.title}</Text>
          <Text style={styles.briefDesc}>
            {lesson.desc || "Practice common phrases used in this situation. Focus on natural pronunciation and tone."}
          </Text>
        </View>

        {/* Example Dialogue */}
        <View style={styles.sectionHeader}>
          <Text style={Typography.h3}>Dialogue Context</Text>
          <Text style={Typography.caption}>Listen to how these phrases fit together</Text>
        </View>

        <View style={styles.dialogueContainer}>
          <TouchableOpacity 
            style={styles.dialogueBubbleLeft}
            onPress={() => speakPhrase(lesson.a, 999)} // Use 999 for dialogue A
          >
            <View style={styles.bubbleHeader}>
              <Text style={styles.speakerLabel}>Person A</Text>
              <Text>🔊</Text>
            </View>
            <Text style={styles.dialogueText}>{lesson.a}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.dialogueBubbleRight}
            onPress={() => speakPhrase(lesson.b, 1000)} // Use 1000 for dialogue B
          >
            <View style={styles.bubbleHeader}>
              <Text style={[styles.speakerLabel, { color: Colors.primary }]}>Person B</Text>
              <Text>🔊</Text>
            </View>
            <Text style={styles.dialogueText}>{lesson.b}</Text>
          </TouchableOpacity>
        </View>

        {/* Key Phrases Carousel */}
        <View style={styles.sectionHeader}>
          <Text style={Typography.h3}>Master Key Phrases</Text>
          <Text style={Typography.caption}>Slide to practice each one</Text>
        </View>

        <FlatList
          ref={flatListRef}
          data={lesson.phrases}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) => {
            const index = Math.round(e.nativeEvent.contentOffset.x / width);
            setCurrentPhraseIndex(index);
          }}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={{ paddingHorizontal: Spacing.md }}
          renderItem={({ item, index }) => (
            <View style={styles.phraseSlide}>
              <View style={styles.phraseCard}>
                <View style={styles.phraseBadge}>
                  <Text style={styles.phraseBadgeText}>{index + 1} / {lesson.phrases.length}</Text>
                </View>
                
                <Text style={styles.phraseMainText}>{item}</Text>
                
                <View style={styles.phraseActions}>
                  <TouchableOpacity 
                    style={styles.actionBtn}
                    onPress={() => speakPhrase(item, index)}
                  >
                    <Text style={styles.actionBtnIcon}>{speakingIndex === index ? '🛑' : '🔊'}</Text>
                    <Text style={styles.actionBtnText}>Listen</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={[styles.actionBtn, styles.actionBtnOutline]}
                    onPress={() => {
                      // Logic for Speech-to-text will go here in Week 3
                      alert("Voice evaluation coming soon! For now, practice saying it out loud.");
                    }}
                  >
                    <Text style={styles.actionBtnIcon}>🎙️</Text>
                    <Text style={[styles.actionBtnText, { color: Colors.primary }]}>Repeat</Text>
                  </TouchableOpacity>
                </View>

                {index < lesson.phrases.length - 1 && (
                  <TouchableOpacity 
                    style={styles.nextBtn}
                    onPress={handleNext}
                  >
                    <Text style={styles.nextBtnText}>Next Phrase →</Text>
                  </TouchableOpacity>
                )}

                {index === lesson.phrases.length - 1 && (
                  <TouchableOpacity 
                    style={[styles.nextBtn, { backgroundColor: '#10B981' }]}
                    onPress={() => router.push({
                      pathname: '/lesson/practice',
                      params: {
                        lessonId: lesson.id,
                        title: lesson.title,
                        desc: lesson.desc,
                        level: lesson.level,
                        phrases: JSON.stringify(lesson.phrases),
                        exampleA: lesson.a,
                        exampleB: lesson.b,
                      }
                    })}
                  >
                    <Text style={styles.nextBtnText}>Ready to Practice! ✅</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
        />

        {/* Carousel Pagination Dots */}
        <View style={styles.pagination}>
          {lesson.phrases.map((_, index) => (
            <View 
              key={index} 
              style={[
                styles.dot, 
                currentPhraseIndex === index && styles.dotActive
              ]} 
            />
          ))}
        </View>

      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  briefCard: {
    backgroundColor: '#2B59FF',
    margin: Spacing.md,
    borderRadius: 20,
    padding: Spacing.lg,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 10,
  },
  briefLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  briefTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 8,
  },
  briefDesc: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 15,
    lineHeight: 22,
  },
  sectionHeader: {
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  dialogueContainer: {
    paddingHorizontal: Spacing.md,
  },
  dialogueBubbleLeft: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderTopLeftRadius: 4,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    alignSelf: 'flex-start',
    maxWidth: '85%',
  },
  dialogueBubbleRight: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 16,
    borderTopRightRadius: 4,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.primary + '30',
    alignSelf: 'flex-end',
    maxWidth: '85%',
  },
  bubbleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
    alignItems: 'center',
  },
  speakerLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  dialogueText: {
    fontSize: 15,
    color: Colors.text,
    lineHeight: 22,
  },
  phraseSlide: {
    width: width,
    paddingRight: Spacing.md * 2, // Accounting for horizontal padding in contentContainer
    alignItems: 'center',
  },
  phraseCard: {
    width: CARD_WIDTH,
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    minHeight: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  phraseBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    position: 'absolute',
    top: 20,
    alignSelf: 'center',
  },
  phraseBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  phraseMainText: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 32,
    marginVertical: Spacing.xl,
  },
  phraseActions: {
    flexDirection: 'row',
    gap: Spacing.md,
    width: '100%',
    marginTop: Spacing.md,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  actionBtnOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  actionBtnIcon: {
    fontSize: 18,
  },
  actionBtnText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  nextBtn: {
    marginTop: Spacing.lg,
    paddingVertical: 10,
  },
  nextBtnText: {
    color: Colors.primary,
    fontWeight: '700',
    fontSize: 15,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.md,
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.border,
  },
  dotActive: {
    width: 24,
    backgroundColor: Colors.primary,
  },
});
