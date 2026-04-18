import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { Colors, Spacing, Typography } from '../constants/Theme';
import { useState, useRef } from 'react';
import { useRouter } from 'expo-router';
import { updateUserLevel } from '../api/user';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';


const { width } = Dimensions.get('window');

const QUESTIONS = [
  {
    id: 1,
    text: "How would you describe your ability to speak English?",
    options: [
      { label: "I can only say basic greetings.", value: 1, level: "A1" },
      { label: "I can have simple conversations about daily life.", value: 2, level: "A2" },
      { label: "I can talk about most familiar topics reasonably well.", value: 3, level: "B1" },
      { label: "I can speak fluently and spontaneously with native speakers.", value: 4, level: "B2/C1" }
    ]
  },
  {
    id: 2,
    text: "How much can you understand when listening to English?",
    options: [
      { label: "I struggle to understand anything beyond slow, clear speech.", value: 1, level: "A1" },
      { label: "I understand the main points of clear, standard speech.", value: 2, level: "B1" },
      { label: "I can follow extended speech even when it's not clearly structured.", value: 3, level: "B2" },
      { label: "I can understand virtually everything, even fast-paced movies.", value: 4, level: "C1/C2" }
    ]
  },
  {
    id: 3,
    text: "Can you write well in English?",
    options: [
      { label: "I can write short, simple phrases.", value: 1, level: "A1" },
      { label: "I can write simple personal or work emails.", value: 2, level: "A2/B1" },
      { label: "I can write clear, detailed texts on many subjects.", value: 3, level: "B2" },
      { label: "I can write complex reports or creative essays perfectly.", value: 4, level: "C1/C2" }
    ]
  }
];

export default function OnboardingScreen() {
  const { refreshProfile } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [scores, setScores] = useState<number[]>([]);
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(1)).current;


  const handleOptionSelect = (value: number) => {
    const newScores = [...scores, value];
    setScores(newScores);

    if (currentStep < QUESTIONS.length - 1) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setCurrentStep(currentStep + 1);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    } else {
      finishOnboarding(newScores);
    }
  };

  const finishOnboarding = async (finalScores: number[]) => {
    const total = finalScores.reduce((a, b) => a + b, 0);
    let level = "B1";
    if (total <= 4) level = "A1";
    else if (total <= 6) level = "A2";
    else if (total <= 8) level = "B1";
    else if (total <= 10) level = "B2";
    else if (total <= 11) level = "C1";
    else level = "C2";

    try {
      // Clean call: No user_id needed anymore!
      await updateUserLevel(level);
      await refreshProfile();
      await AsyncStorage.setItem('user_level_set', 'true');
      router.replace('/(tabs)');
    } catch (err) {
      console.error('Onboarding update failed:', err);
      router.replace('/(tabs)'); // Still redirect so user isn't stuck
    }
  };


  const currentQuestion = QUESTIONS[currentStep];

  return (
    <View style={styles.container}>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${((currentStep + 1) / QUESTIONS.length) * 100}%` }]} />
      </View>

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <Text style={styles.stepText}>Question {currentStep + 1} of {QUESTIONS.length}</Text>
        <Text style={styles.questionText}>{currentQuestion.text}</Text>

        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.optionCard}
              onPress={() => handleOptionSelect(option.value)}
              activeOpacity={0.7}
            >
              <Text style={styles.optionText}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>

      <View style={styles.footer}>
          <Text style={styles.footerText}>This helps us tailor Coach Priya's responses to your level.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 80,
    paddingHorizontal: Spacing.lg,
  },
  progressBar: {
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3,
    marginBottom: 40,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
  },
  content: {
    flex: 1,
  },
  stepText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
  },
  questionText: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 40,
    lineHeight: 36,
  },
  optionsContainer: {
    gap: Spacing.md,
  },
  optionCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    lineHeight: 22,
  },
  footer: {
    paddingBottom: 40,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  }
});
