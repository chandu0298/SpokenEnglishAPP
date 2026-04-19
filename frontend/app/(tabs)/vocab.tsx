import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography } from '../../constants/Theme';
import {
  VocabCard,
  BucketCounts,
  startSession,
  submitResult,
  fetchBuckets,
  generateScenario,
  startRevision,
  fetchLevelStats,
  LevelStats,
} from '../../api/vocabulary';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - Spacing.md * 2;

// Mock user ID until Firebase auth is wired
const MOCK_USER_ID = '00000000-0000-0000-0000-000000000001';

// ─── Level Configuration ──────────────────────────────────────────
const LEVELS = [
  { id: 'B1', label: 'B1', subtitle: 'Intermediate', color: '#BA7517', emoji: '🌱' },
  { id: 'B2', label: 'B2', subtitle: 'Upper Inter.', color: '#378ADD', emoji: '🌿' },
  { id: 'C1', label: 'C1', subtitle: 'Advanced', color: '#534AB7', emoji: '🌳' },
  { id: 'C2', label: 'C2', subtitle: 'Mastery', color: '#C4383A', emoji: '🏔️' },
];

// ─── Bucket Colors ────────────────────────────────────────────────
const BUCKET_CONFIG = {
  learning:  { label: 'Learning',  color: '#FF6B6B', emoji: '📖' },
  reviewing: { label: 'Reviewing', color: '#FFA726', emoji: '🔄' },
  strong:    { label: 'Strong',    color: '#66BB6A', emoji: '💪' },
  mastered:  { label: 'Mastered',  color: '#42A5F5', emoji: '⭐' },
};

// ═══════════════════════════════════════════════════════════════════
// ─── Flashcard Component (3D Flip) ────────────────────────────────
// ═══════════════════════════════════════════════════════════════════

interface FlashcardProps {
  card: VocabCard;
  onResult: (result: 'knew_it' | 'still_learning') => void;
  cardIndex: number;
  totalCards: number;
}

function Flashcard({ card, onResult, cardIndex, totalCards }: FlashcardProps) {
  const flipAnim = useRef(new Animated.Value(0)).current;
  const [isFlipped, setIsFlipped] = useState(false);
  const [liveScenario, setLiveScenario] = useState<string | null>(null);
  const [loadingScenario, setLoadingScenario] = useState(false);

  // Reset when card changes
  useEffect(() => {
    flipAnim.setValue(0);
    setIsFlipped(false);
    setLiveScenario(null);
    setLoadingScenario(false);
  }, [card.word_id]);

  const handleFlip = () => {
    if (isFlipped) return; // Only flip once
    setIsFlipped(true);
    Animated.spring(flipAnim, {
      toValue: 1,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
  };

  const handleRefreshScenario = async () => {
    setLoadingScenario(true);
    try {
      const scenario = await generateScenario(card.word, card.meaning, card.level || 'B1');
      setLiveScenario(scenario);
    } catch (error) {
      console.error('Failed to generate scenario:', error);
    }
    setLoadingScenario(false);
  };

  // Front face rotation: 0° → 90°
  const frontRotation = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['0deg', '90deg', '90deg'],
  });

  // Back face rotation: -90° → 0°
  const backRotation = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['-90deg', '-90deg', '0deg'],
  });

  // Front opacity
  const frontOpacity = flipAnim.interpolate({
    inputRange: [0, 0.5, 0.5001, 1],
    outputRange: [1, 1, 0, 0],
  });

  // Back opacity
  const backOpacity = flipAnim.interpolate({
    inputRange: [0, 0.4999, 0.5, 1],
    outputRange: [0, 0, 1, 1],
  });

  const displayScenario = liveScenario || card.example_sentence;

  return (
    <View style={cardStyles.container}>
      {/* Card Counter */}
      <Text style={cardStyles.counter}>
        {cardIndex + 1} / {totalCards}
      </Text>

      <View style={cardStyles.flipContainer}>
        {/* ─── FRONT FACE ─── */}
        <Animated.View
          style={[
            cardStyles.card,
            cardStyles.frontCard,
            {
              transform: [{ perspective: 1000 }, { rotateY: frontRotation }],
              opacity: frontOpacity,
            },
          ]}
        >
          <TouchableOpacity
            style={cardStyles.cardTouchable}
            onPress={handleFlip}
            activeOpacity={0.95}
          >
            <View style={cardStyles.bucketBadge}>
              <Text style={cardStyles.bucketText}>
                {BUCKET_CONFIG[card.bucket as keyof typeof BUCKET_CONFIG]?.emoji || '📖'}{' '}
                {BUCKET_CONFIG[card.bucket as keyof typeof BUCKET_CONFIG]?.label || 'Learning'}
              </Text>
            </View>

            <Text style={cardStyles.wordText}>{card.word}</Text>
            <Text style={cardStyles.phoneticText}>/{card.phonetic}/</Text>

            <View style={cardStyles.tapHint}>
              <Text style={cardStyles.tapHintText}>👆 Tap to reveal meaning</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* ─── BACK FACE ─── */}
        <Animated.View
          style={[
            cardStyles.card,
            cardStyles.backCard,
            {
              transform: [{ perspective: 1000 }, { rotateY: backRotation }],
              opacity: backOpacity,
            },
          ]}
        >
          <ScrollView
            style={cardStyles.backScrollView}
            contentContainerStyle={cardStyles.backContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Word header */}
            <Text style={cardStyles.backWordText}>{card.word}</Text>

            {/* Meaning */}
            <View style={cardStyles.section}>
              <Text style={cardStyles.sectionLabel}>📝 Meaning</Text>
              <Text style={cardStyles.meaningText}>{card.meaning}</Text>
            </View>

            {/* Root Words */}
            {card.roots && card.roots.length > 0 && (
              <View style={cardStyles.section}>
                <Text style={cardStyles.sectionLabel}>🌿 Root Words</Text>
                {card.roots.map((root, idx) => (
                  <Text key={idx} style={cardStyles.rootText}>• {root}</Text>
                ))}
              </View>
            )}

            {/* Scenario */}
            <View style={cardStyles.section}>
              <View style={cardStyles.scenarioHeader}>
                <Text style={cardStyles.sectionLabel}>💡 Real-World Scenario</Text>
                <TouchableOpacity
                  style={cardStyles.refreshButton}
                  onPress={handleRefreshScenario}
                  disabled={loadingScenario}
                >
                  {loadingScenario ? (
                    <ActivityIndicator size="small" color={Colors.primary} />
                  ) : (
                    <Text style={cardStyles.refreshText}>🔄 AI</Text>
                  )}
                </TouchableOpacity>
              </View>
              <Text style={cardStyles.scenarioText}>"{displayScenario}"</Text>
            </View>

            {/* Action Buttons */}
            <View style={cardStyles.actionRow}>
              <TouchableOpacity
                style={[cardStyles.actionButton, cardStyles.knewItButton]}
                onPress={() => onResult('knew_it')}
              >
                <Text style={cardStyles.actionButtonText}>✓ I knew it</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[cardStyles.actionButton, cardStyles.learningButton]}
                onPress={() => onResult('still_learning')}
              >
                <Text style={cardStyles.actionButtonText}>↻ Still learning</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Animated.View>
      </View>
    </View>
  );
}

// ═══════════════════════════════════════════════════════════════════
// ─── Main Vocab Screen ────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════

type ViewMode = 'level_select' | 'session' | 'summary';

export default function VocabScreen() {
  const [viewMode, setViewMode] = useState<ViewMode>('level_select');
  const [isRevisionMode, setIsRevisionMode] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [cards, setCards] = useState<VocabCard[]>([]);
  const [levelStats, setLevelStats] = useState<Record<string, LevelStats>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [sessionResults, setSessionResults] = useState<{
    knew: number;
    learning: number;
  }>({ knew: 0, learning: 0 });

  const loadStats = useCallback(async () => {
    try {
      const stats = await fetchLevelStats(MOCK_USER_ID);
      setLevelStats(stats);
    } catch (e) {
      console.error('Failed to load level stats', e);
    }
  }, []);

  useEffect(() => {
    if (viewMode === 'level_select') {
      loadStats();
    }
  }, [viewMode, loadStats]);

  // ─── Start a learning session ────────────────────────────────
  const handleStartSession = async (level: string) => {
    setSelectedLevel(level);
    setLoading(true);
    try {
      const session = await startSession(MOCK_USER_ID, level, 10);
      
      // Check if next batch is locked (need to complete revision first)
      if (session.batch_info?.next_batch_locked && session.cards.length === 0) {
        Alert.alert(
          'Complete Revision First! 🔄',
          `You have ${session.due_count} words due for revision. Complete your spaced revision to unlock the next batch of words!`,
          [
            { text: 'OK' },
            { 
              text: 'Go to Revision', 
              onPress: () => handleStartRevision(level)
            }
          ]
        );
        setLoading(false);
        return;
      }
      
      // Check if level is completely done
      if (session.batch_info?.level_complete) {
        Alert.alert(
          'Level Mastered! 🏆',
          `Congratulations! You've completed all ${session.batch_info.total_words_in_level} words in ${level}. Try a higher level!`,
          [{ text: 'OK' }]
        );
        setLoading(false);
        return;
      }
      
      if (session.cards.length === 0) {
        Alert.alert(
          'Batch Complete! 🎉',
          'Great job! Complete your spaced revision to unlock the next batch of words.',
          [{ text: 'OK' }]
        );
        setLoading(false);
        return;
      }
      setCards(session.cards);
      setCurrentIndex(0);
      setSessionResults({ knew: 0, learning: 0 });
      setViewMode('session');
    } catch (error) {
      console.error('Failed to start session:', error);
      Alert.alert('Connection Error', 'Could not connect to the server. Please check your connection.');
    }
    setLoading(false);
  };

  // ─── Start Spaced Revision ───────────────────────────────────
  const handleStartRevision = async (level: string) => {
    setLoading(true);
    try {
      const session = await startRevision(MOCK_USER_ID, level, 20);
      if (session.cards.length === 0) {
        Alert.alert(
          'All caught up!',
          `You have no ${level} words to revise right now. Great job!`,
          [{ text: 'OK' }]
        );
        setLoading(false);
        return;
      }
      setCards(session.cards);
      setCurrentIndex(0);
      setSessionResults({ knew: 0, learning: 0 });
      setSelectedLevel(`${level} Revision`);
      setViewMode('session');
    } catch (error) {
      console.error('Failed to start revision:', error);
      Alert.alert('Connection Error', 'Could not open Spaced Revision.');
    }
    setLoading(false);
  };

  // ─── Handle card result ──────────────────────────────────────
  const handleResult = async (result: 'knew_it' | 'still_learning') => {
    const currentCard = cards[currentIndex];
    try {
      await submitResult(MOCK_USER_ID, currentCard.word_id, result);
    } catch (error) {
      console.error('Failed to submit result:', error);
    }

    setSessionResults((prev) => ({
      knew: result === 'knew_it' ? prev.knew + 1 : prev.knew,
      learning: result === 'still_learning' ? prev.learning + 1 : prev.learning,
    }));

    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setViewMode('summary');
    }
  };

  // ─── Render: Level Selector ──────────────────────────────────
  const renderLevelSelector = () => (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <Text style={Typography.h1}>
          {isRevisionMode ? 'Spaced Revision 🔄' : 'Vocabulary 📚'}
        </Text>
        <Text style={[Typography.body, { marginTop: Spacing.xs }]}>
          {isRevisionMode 
            ? 'Select a level to revise words you are still learning'
            : 'Select your level and start learning new words'}
        </Text>
      </View>

      {/* Level Cards Grid */}
      <View style={styles.levelGrid}>
        {LEVELS.map((level) => {
          const stats = levelStats[level.id];
          const currentBatch = stats?.current_batch || 1;
          const totalBatches = stats?.total_batches || 1;
          
          return (
            <TouchableOpacity
              key={level.id}
              style={[styles.levelCard, { borderColor: level.color }]}
              onPress={() => isRevisionMode ? handleStartRevision(level.id) : handleStartSession(level.id)}
              activeOpacity={0.8}
            >
              <Text style={styles.levelEmoji}>{level.emoji}</Text>
              <Text style={[styles.levelLabel, { color: level.color }]}>{level.label}</Text>
              <Text style={styles.levelSubtitle}>{level.subtitle}</Text>
              
              {/* Batch Progress Indicator */}
              {!isRevisionMode && totalBatches > 1 && (
                <Text style={styles.batchText}>
                  Batch {currentBatch}/{totalBatches}
                </Text>
              )}
              
              <View style={[styles.levelBadge, { backgroundColor: level.color }]}>
                <Text style={styles.levelBadgeText}>
                  {isRevisionMode 
                    ? `${stats?.due || 0} to review` 
                    : `${stats?.new || 0} new words`}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Toggle Button */}
      <TouchableOpacity
        style={styles.myListButton}
        onPress={() => setIsRevisionMode(!isRevisionMode)}
        activeOpacity={0.8}
      >
        <Text style={styles.myListButtonText}>
          {isRevisionMode ? '🌱 Back to Learning New Words' : '🔄 Switch to Spaced Revision'}
        </Text>
      </TouchableOpacity>

      {/* Quick Info */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>How it works</Text>
        <Text style={styles.infoText}>
          🃏 Tap a card to flip and reveal the meaning{'\n'}
          ✓ Mark "I knew it" to promote the word{'\n'}
          ↻ Mark "Still learning" to see it again tomorrow{'\n'}
          📊 Words move through 4 buckets as you learn{'\n'}
          🔁 Come back daily — spaced repetition works!
        </Text>
      </View>
    </ScrollView>
  );

  // ─── Render: Session (Flashcards) ────────────────────────────
  const renderSession = () => (
    <View style={styles.sessionContainer}>
      {/* Session Header */}
      <View style={styles.sessionHeader}>
        <TouchableOpacity
          onPress={() => setViewMode('level_select')}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.sessionTitle}>{selectedLevel} Session</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Flashcard */}
      {cards[currentIndex] && (
        <Flashcard
          card={cards[currentIndex]}
          onResult={handleResult}
          cardIndex={currentIndex}
          totalCards={cards.length}
        />
      )}
    </View>
  );

  // ─── Render: Session Summary ─────────────────────────────────
  const renderSummary = () => (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryEmoji}>🎉</Text>
        <Text style={Typography.h2}>Session Complete!</Text>
        <Text style={[Typography.body, { textAlign: 'center', marginTop: Spacing.sm }]}>
          You reviewed {cards.length} words in {selectedLevel}
        </Text>

        <View style={styles.summaryStats}>
          <View style={[styles.statCard, { backgroundColor: '#E8F5E9' }]}>
            <Text style={styles.statNumber}>{sessionResults.knew}</Text>
            <Text style={styles.statLabel}>✓ Knew it</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#FFF3E0' }]}>
            <Text style={styles.statNumber}>{sessionResults.learning}</Text>
            <Text style={styles.statLabel}>↻ Still learning</Text>
          </View>
        </View>

        {!selectedLevel?.includes('Revision') && (
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => handleStartSession(selectedLevel!)}
          >
            <Text style={styles.primaryButtonText}>🔁 Practice More</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={selectedLevel?.includes('Revision') ? styles.primaryButton : styles.secondaryButton}
          onPress={() => {
            if (selectedLevel?.includes('Revision')) {
              handleStartRevision(selectedLevel.replace(' Revision', ''));
            } else {
              setIsRevisionMode(true);
              setViewMode('level_select');
            }
          }}
        >
          <Text style={selectedLevel?.includes('Revision') ? styles.primaryButtonText : styles.secondaryButtonText}>
            {selectedLevel?.includes('Revision') ? '🔄 Keep Revising' : '🔄 Switch to Spaced Revision'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => setViewMode('level_select')}
        >
          <Text style={styles.secondaryButtonText}>← Done</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  // ─── Loading Overlay ─────────────────────────────────────────
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={[Typography.body, { marginTop: Spacing.md }]}>
            Loading your cards...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // ─── Main Render ─────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.container}>
      {viewMode === 'level_select' && renderLevelSelector()}
      {viewMode === 'session' && renderSession()}
      {viewMode === 'summary' && renderSummary()}
    </SafeAreaView>
  );
}

// ═══════════════════════════════════════════════════════════════════
// ─── Flashcard Styles ─────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════

const cardStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.md,
  },
  counter: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    fontWeight: '600',
  },
  flipContainer: {
    width: CARD_WIDTH,
    height: 420,
  },
  card: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 24,
    backfaceVisibility: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  frontCard: {
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  backCard: {
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.success,
  },
  cardTouchable: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  bucketBadge: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  bucketText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
  },
  wordText: {
    fontSize: 42,
    fontWeight: '800',
    color: Colors.text,
    textAlign: 'center',
    letterSpacing: 1,
  },
  phoneticText: {
    fontSize: 18,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
    fontStyle: 'italic',
  },
  tapHint: {
    position: 'absolute',
    bottom: Spacing.xl,
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  tapHintText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  backScrollView: {
    flex: 1,
    borderRadius: 24,
  },
  backContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  backWordText: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  section: {
    marginBottom: Spacing.md,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  meaningText: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.text,
  },
  rootText: {
    fontSize: 14,
    lineHeight: 22,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  scenarioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  refreshButton: {
    padding: 4,
  },
  refreshText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600',
  },
  scenarioText: {
    fontSize: 15,
    lineHeight: 22,
    color: Colors.primary,
    fontStyle: 'italic',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: Spacing.md,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  knewItButton: {
    backgroundColor: '#27C468',
  },
  learningButton: {
    backgroundColor: '#FF6B6B',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
});

// ═══════════════════════════════════════════════════════════════════
// ─── Main Screen Styles ───────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ─── Level Selector ──────────────────
  levelGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: Spacing.lg,
  },
  levelCard: {
    width: (SCREEN_WIDTH - Spacing.md * 2 - 12) / 2,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  levelEmoji: {
    fontSize: 32,
    marginBottom: Spacing.xs,
  },
  levelLabel: {
    fontSize: 28,
    fontWeight: '800',
  },
  levelSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  batchText: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 4,
    fontWeight: '500',
  },
  levelBadge: {
    marginTop: Spacing.sm,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  levelBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },

  // ─── My List Button ──────────────────
  myListButton: {
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  myListButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '700',
  },

  // ─── Info Card ────────────────────────
  infoCard: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 16,
    padding: Spacing.md,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: Spacing.sm,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 24,
    color: Colors.text,
  },

  // ─── Session ──────────────────────────
  sessionContainer: {
    flex: 1,
  },
  sessionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  backButton: {
    padding: Spacing.xs,
  },
  backButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  sessionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },

  // ─── Summary ──────────────────────────
  summaryContainer: {
    alignItems: 'center',
    paddingTop: Spacing.xxl,
  },
  summaryEmoji: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  summaryStats: {
    flexDirection: 'row',
    gap: 16,
    marginTop: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  statCard: {
    width: 130,
    padding: Spacing.md,
    borderRadius: 16,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 36,
    fontWeight: '800',
    color: Colors.text,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },

  // ─── Buttons ──────────────────────────
  primaryButton: {
    backgroundColor: Colors.primary,
    width: '100%',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: Colors.surface,
    width: '100%',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  secondaryButtonText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
  },

  // ─── My List / Progress ───────────────
  overallProgress: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.primaryLight,
    borderRadius: 4,
    marginTop: Spacing.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  bucketGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: Spacing.lg,
  },
  bucketCard: {
    width: (SCREEN_WIDTH - Spacing.md * 2 - 12) / 2,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: Spacing.md,
    alignItems: 'center',
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  bucketEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  bucketCount: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.text,
  },
  bucketLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500',
  },

  // ─── Level Breakdown ──────────────────
  levelBreakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  levelBreakdownLeft: {
    width: 70,
  },
  levelBreakdownLabel: {
    fontSize: 18,
    fontWeight: '800',
  },
  miniProgressBar: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.primaryLight,
    borderRadius: 3,
    marginHorizontal: Spacing.sm,
    overflow: 'hidden',
  },
  miniProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  percentText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textSecondary,
    width: 45,
    textAlign: 'right',
  },

  // ─── Empty State ──────────────────────
  emptyState: {
    alignItems: 'center',
    paddingTop: Spacing.xxl,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
});
