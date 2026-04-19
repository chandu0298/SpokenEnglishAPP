import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator, 
  Image, 
  Platform, 
  UIManager,
  Dimensions
} from 'react-native';
import { Colors, Spacing, Radius, Palettes, Typography } from '../../constants/Theme';
import { useTheme } from '../../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { fetchDailyOrigin, WordOrigin } from '../../api/vocabulary';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import * as Progress from 'react-native-progress';

const { width } = Dimensions.get('window');

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// STATIC MIC COMPONENT FOR HERO CTA (Reanimated Disabled for stability)
function PulseCircle() {
  return (
    <View style={[styles.pulse, { opacity: 0.2, transform: [{ scale: 1.1 }] }]} />
  );
}

export default function HomeScreen() {
  const { colors, mode } = useTheme();
  const { profile, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [dailyOrigin, setDailyOrigin] = useState<WordOrigin | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [originLoading, setOriginLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadDailyOrigin();
    }, [])
  );

  async function loadDailyOrigin() {
    try {
      setOriginLoading(true);
      const data = await fetchDailyOrigin();
      if (data) {
        setDailyOrigin(data);
      } else {
        throw new Error('No data');
      }
    } catch (e) {
      console.warn('Recovering: Using fallback for daily origin:', e);
      // Premium Fallback to keep the UI beautiful
      setDailyOrigin({
        word: "Ambition",
        origin_title: "A Drive for Success",
        short_preview: "From the Latin 'ambitio', meaning 'going around'.",
        full_story: "In ancient Rome, 'ambitio' referred to the practice of candidates going around to solicit votes. Today, it describes the strong desire to achieve success!"
      });
    } finally {
      setOriginLoading(false);
    }
  }

  if (authLoading && !profile) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* 1) MOTIVATIONAL STATUS HEADER */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={[styles.greetingLabel, { color: colors.textSecondary }]}>
                {new Date().getHours() < 12 ? 'Good Morning' : 'Good Evening'},
              </Text>
              <Text style={[Typography.h1, { color: colors.text, fontWeight: '800', letterSpacing: -1.5 }]}>
                {profile?.name?.split(' ')[0] || 'Learner'} 👋
              </Text>
            </View>
            <TouchableOpacity style={[styles.streakPill, { backgroundColor: colors.accent + '15' }]}>
              <Ionicons name="flame" size={22} color={colors.accent} />
              <Text style={[styles.streakText, { color: colors.accent }]}>7 Days</Text>
            </TouchableOpacity>
          </View>
          <Text style={[styles.motivational, { color: colors.textSecondary, letterSpacing: -0.2 }]}>
            Let's improve your speaking confidence today.
          </Text>
        </View>

        {/* 2) PRIMARY HERO CTA CARD */}
        <TouchableOpacity 
          activeOpacity={0.9}
          style={[styles.heroCard, { backgroundColor: colors.primary }]}
          onPress={() => router.push('/(tabs)/chat')}
        >
          <View style={styles.heroLeft}>
            <Text style={styles.heroTitle}>Start Speaking Now</Text>
            <Text style={styles.heroSubtitle}>Practice with AI Coach Priya</Text>
            <View style={styles.durationPill}>
              <Ionicons name="time-outline" size={14} color="#FFF" />
              <Text style={styles.durationText}>5-10 min session</Text>
            </View>
          </View>
          <View style={styles.heroRight}>
            <PulseCircle />
            <View style={styles.micCircle}>
              <Ionicons name="mic" size={32} color={colors.primary} />
            </View>
          </View>
        </TouchableOpacity>

        {/* 3) PROGRESS DASHBOARD SECTION */}
        <View style={styles.sectionHeader}>
          <Text style={[Typography.h3, { color: colors.text, letterSpacing: -0.5 }]}>Today's Progress</Text>
        </View>
        <View style={[styles.progressCard, { backgroundColor: colors.surface, borderStyle: 'solid' }]}>
          <View style={styles.ringContainer}>
            <Progress.Circle 
              size={74} 
              progress={0.65} 
              color={colors.primary} 
              unfilledColor={colors.primary + '08'} 
              borderWidth={0} 
              thickness={7}
              strokeCap="round"
            />
            <Text style={styles.ringLabel}>Fluency</Text>
            <Text style={[styles.ringPercent, { color: colors.primary }]}>65%</Text>
          </View>
          <View style={styles.ringContainer}>
            <Progress.Circle 
              size={74} 
              progress={0.82} 
              color={colors.accent} 
              unfilledColor={colors.accent + '08'} 
              borderWidth={0} 
              thickness={7}
              strokeCap="round"
            />
            <Text style={styles.ringLabel}>Accuracy</Text>
            <Text style={[styles.ringPercent, { color: colors.accent }]}>82%</Text>
          </View>
          <View style={styles.ringContainer}>
            <Progress.Circle 
              size={74} 
              progress={0.4} 
              color="#6366f1" 
              unfilledColor="#6366f108" 
              borderWidth={0} 
              thickness={7}
              strokeCap="round"
            />
            <Text style={styles.ringLabel}>Module</Text>
            <Text style={[styles.ringPercent, { color: '#6366f1' }]}>4/10</Text>
          </View>
        </View>

        {/* 4) DAILY MODULES GRID */}
        <View style={styles.sectionHeader}>
          <Text style={[Typography.h3, { color: colors.text }]}>Daily Modules</Text>
          <TouchableOpacity><Text style={{ color: colors.primary, fontWeight: '600' }}>See All</Text></TouchableOpacity>
        </View>

        <View style={styles.moduleGrid}>
          {/* Pronunciation Drills */}
          <TouchableOpacity 
            style={[styles.moduleCard, { backgroundColor: colors.surface, shadowColor: colors.primary }]}
            onPress={() => router.push('/(tabs)/pronounce')}
          >
            <View style={[styles.moduleIcon, { backgroundColor: colors.accent + '10' }]}>
              <Ionicons name="mic-outline" size={24} color={colors.accent} />
            </View>
            <Text style={[styles.moduleTitle, { color: colors.text }]}>Pronunciation</Text>
            <Text style={[styles.moduleSub, { color: colors.textSecondary }]}>Improve clarity</Text>
            <View style={styles.moduleProgress}>
              <Progress.Bar progress={0.4} width={null} color={colors.accent} unfilledColor="#F1F5F9" borderWidth={0} height={5} borderRadius={10}/>
              <Text style={styles.modulePercent}>40%</Text>
            </View>
          </TouchableOpacity>

          {/* Vocabulary Speaking */}
          <TouchableOpacity 
            style={[styles.moduleCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => router.push('/(tabs)/vocab')}
          >
            <View style={[styles.moduleIcon, { backgroundColor: '#EFF6FF' }]}>
              <Ionicons name="book-outline" size={24} color={colors.primary} />
            </View>
            <Text style={[styles.moduleTitle, { color: colors.text }]}>Vocabulary</Text>
            <Text style={[styles.moduleSub, { color: colors.textSecondary }]}>Context usage</Text>
            <View style={styles.moduleProgress}>
              <Progress.Bar progress={0.7} width={null} color={colors.primary} unfilledColor="#F1F5F9" borderWidth={0} height={4} />
              <Text style={styles.modulePercent}>70%</Text>
            </View>
          </TouchableOpacity>

          {/* Interview Prep */}
          <TouchableOpacity 
            style={[styles.moduleCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
          >
            <View style={[styles.moduleIcon, { backgroundColor: '#FFF7ED' }]}>
              <Ionicons name="briefcase-outline" size={24} color="#F97316" />
            </View>
            <Text style={[styles.moduleTitle, { color: colors.text }]}>Interview Prep</Text>
            <Text style={[styles.moduleSub, { color: colors.textSecondary }]}>Job readiness</Text>
            <View style={styles.moduleProgress}>
              <Progress.Bar progress={0.1} width={null} color="#F97316" unfilledColor="#F1F5F9" borderWidth={0} height={4} />
              <Text style={styles.modulePercent}>10%</Text>
            </View>
          </TouchableOpacity>

          {/* Business English */}
          <TouchableOpacity 
            style={[styles.moduleCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
          >
            <View style={[styles.moduleIcon, { backgroundColor: '#F5F3FF' }]}>
              <Ionicons name="globe-outline" size={24} color="#8B5CF6" />
            </View>
            <Text style={[styles.moduleTitle, { color: colors.text }]}>Business</Text>
            <Text style={[styles.moduleSub, { color: colors.textSecondary }]}>Global meetings</Text>
            <View style={styles.moduleProgress}>
              <Progress.Bar progress={0.0} width={null} color="#8B5CF6" unfilledColor="#F1F5F9" borderWidth={0} height={4} />
              <Text style={styles.modulePercent}>0%</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* 5) DISCOVERY SECTION (Fact of the day) */}
        {dailyOrigin && (
          <View style={styles.footerSection}>
             <TouchableOpacity 
              activeOpacity={0.9}
              style={[styles.factBanner, { backgroundColor: colors.primaryLight, borderColor: colors.primary + '20' }]}
              onPress={() => {
                setIsExpanded(!isExpanded);
              }}
            >
              <View style={styles.factRow}>
                <View style={[styles.pill, { backgroundColor: colors.primary }]}>
                  <Text style={styles.pillText}>DID YOU KNOW?</Text>
                </View>
                <Text style={[styles.factTitle, { color: colors.text }]}>{dailyOrigin.word}</Text>
                <Ionicons name={isExpanded ? "chevron-up" : "chevron-forward"} size={16} color={colors.primary} style={{ marginLeft: 'auto'}} />
              </View>
              
              <Text style={[styles.factText, { color: colors.text }]} numberOfLines={isExpanded ? 0 : 2}>
                {isExpanded ? dailyOrigin.full_story : dailyOrigin.short_preview}
              </Text>
            </TouchableOpacity>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xl,
    paddingTop: Spacing.sm,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // HEADER
  header: {
    marginBottom: Spacing.lg,
    marginTop: Spacing.xs,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  greetingLabel: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: -2,
  },
  motivational: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
  },
  streakPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.lg,
    gap: 6,
  },
  streakText: {
    fontSize: 14,
    fontWeight: '800',
  },
  // HERO CARD
  heroCard: {
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xl,
    shadowColor: '#3B52FF',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },
  heroLeft: {
    flex: 1,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFF',
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
    marginBottom: 16,
  },
  durationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.sm,
    gap: 4,
  },
  durationText: {
    fontSize: 12,
    color: '#FFF',
    fontWeight: '700',
  },
  heroRight: {
    position: 'relative',
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
  },
  micCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  pulse: {
    position: 'absolute',
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFF',
  },
  // SECTION HEADERS
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  // PROGRESS DASHBOARD
  progressCard: {
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderColor: 'transparent',
    backgroundColor: Colors.surface,
    marginBottom: Spacing.xl,
    shadowColor: 'rgba(59, 82, 255, 0.12)',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 4,
  },
  ringContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  ringLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    marginTop: 8,
  },
  ringPercent: {
    position: 'absolute',
    top: 25,
    fontSize: 12,
    fontWeight: '800',
  },
  // MODULE GRID
  moduleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  moduleCard: {
    width: (width - Spacing.md * 3) / 2,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 1,
  },
  moduleIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  moduleTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 2,
  },
  moduleSub: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 12,
  },
  moduleProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modulePercent: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  // DISCOVERY
  footerSection: {
    marginTop: Spacing.sm,
  },
  factBanner: {
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    borderWidth: 1,
    marginBottom: Spacing.md,
  },
  factRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: 8,
  },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
  },
  pillText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '900',
  },
  factTitle: {
    fontSize: 18,
    fontWeight: '800',
    textTransform: 'capitalize',
  },
  factText: {
    fontSize: 15,
    lineHeight: 22,
    opacity: 0.9,
  }
});
