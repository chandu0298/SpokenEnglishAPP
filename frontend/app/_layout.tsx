import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { ThemeProvider, useTheme } from '../context/ThemeContext';

function RootLayoutNav() {
  const { user, profile, loading } = useAuth();
  const { colors, mode } = useTheme();

  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Wait for auth to initialize
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const onOnboarding = segments[0] === 'onboarding';

    if (!user) {
      if (!inAuthGroup) {
        router.replace('/(auth)/login');
      }
    } else {
      // If we have a user, wait for the profile details to load from backend
      if (!profile) return;

      if (inAuthGroup) {
        if (profile.cefr_level === 'INITIAL') {
          router.replace('/onboarding');
        } else {
          router.replace('/(tabs)');
        }
      } else if (!onOnboarding && profile.cefr_level === 'INITIAL') {
        router.replace('/onboarding');
      } else if (onOnboarding && profile.cefr_level !== 'INITIAL') {
          router.replace('/(tabs)');
      }
    }
  }, [user, profile, loading, segments]);


  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.surface,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding" options={{ headerShown: false, gestureEnabled: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
    </ThemeProvider>
  );
}
