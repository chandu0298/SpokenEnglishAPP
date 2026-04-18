import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Colors, Spacing, Typography } from '../../../constants/Theme';
import { useEffect, useState } from 'react';
import { fetchLessonDetail, LessonDetail } from '../../../api/lessons';

const MOCK_USER_ID = '00000000-0000-0000-0000-000000000001';

export default function PhaseSelectorScreen() {
  const { id, phase: initialPhase } = useLocalSearchParams<{ id: string, phase?: string }>();
  const router = useRouter();
  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPhase, setCurrentPhase] = useState(parseInt(initialPhase || '1', 10));

  useEffect(() => {
    if (id) {
      fetchLessonDetail(Number(id), MOCK_USER_ID)
        .then((data) => {
          setLesson(data);
          if (data.user_progress) {
            setCurrentPhase(data.user_progress.current_phase);
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading || !lesson) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const PHASES = [
    { title: 'Learn Vocabulary', desc: 'Read through key phrases', icon: '📚' },
    { title: 'Listen & Repeat', desc: 'Audio pronunciation practice', icon: '🎧' },
    { title: 'Fill in the blanks', desc: 'Conversation gap fill', icon: '✍️' },
    { title: 'Roleplay with Priya', desc: 'Live AI speech scenario', icon: '🎙️' },
    { title: 'Real-world Challenge', desc: 'Use it offline', icon: '🏆' }
  ];

  function handlePhasePress(phaseIndex: number) {
    if (phaseIndex > currentPhase) return;

    if (phaseIndex === 1) {
      router.push(`/lesson/${id}/vocab`);
    } else if (phaseIndex === 2) {
      // Phase 2: Listen & Repeat (re-uses vocab with more focus on audio)
      router.push(`/lesson/${id}/vocab`); 
    } else if (phaseIndex === 3) {
      // Phase 3 (Placeholder for fill blanks)
      alert("Fill in the blanks is coming in Week 2!");
    } else if (phaseIndex === 4) {
      // Roleplay
      router.push({
        pathname: '/lesson/practice',
        params: {
          lessonId: lesson!.id,
          title: lesson!.title,
          desc: lesson!.desc,
          level: lesson!.level,
          phrases: JSON.stringify(lesson!.phrases),
          exampleA: lesson!.a,
          exampleB: lesson!.b,
        }
      });
    } else if (phaseIndex === 5) {
      // Placeholder for challenge
      alert("Real-world challenge is coming in Week 5!");
    }
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Select Phase' }} />
      <ScrollView style={styles.container} contentContainerStyle={{ padding: Spacing.md }}>
        <Text style={Typography.h1}>{lesson.title}</Text>
        <Text style={[Typography.body, { marginBottom: Spacing.xl }]}>Complete these 5 phases to fully master this scenario.</Text>

        {PHASES.map((p, index) => {
          const stepNumber = index + 1;
          const isLocked = stepNumber > currentPhase;
          const isDone = stepNumber < currentPhase;
          const isActive = stepNumber === currentPhase;

          return (
            <TouchableOpacity 
              key={stepNumber}
              style={[
                styles.phaseCard,
                isLocked && styles.phaseCardLocked,
                isActive && styles.phaseCardActive,
              ]}
              activeOpacity={0.7}
              onPress={() => handlePhasePress(stepNumber)}
            >
              <View style={styles.iconContainer}>
                <Text style={styles.icon}>{isLocked ? '🔒' : p.icon}</Text>
              </View>
              <View style={styles.content}>
                <Text style={[styles.title, isLocked && styles.textLocked]}>
                  Phase {stepNumber}: {p.title}
                </Text>
                <Text style={[styles.desc, isLocked && styles.textLocked]}>{p.desc}</Text>
              </View>
              
              {isDone && <Text style={styles.check}>✅</Text>}
              {isActive && <Text style={styles.startBadge}>Current</Text>}
            </TouchableOpacity>
          );
        })}
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
  phaseCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: 16,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center'
  },
  phaseCardLocked: {
    opacity: 0.5,
    backgroundColor: Colors.background,
  },
  phaseCardActive: {
    borderColor: Colors.primary,
    borderWidth: 2,
    backgroundColor: '#F0F5FF',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  icon: {
    fontSize: 20,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
  desc: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  textLocked: {
    color: Colors.textSecondary,
  },
  check: {
    fontSize: 16,
  },
  startBadge: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
    backgroundColor: '#D1E0FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  }
});
