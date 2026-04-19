import { Redirect } from 'expo-router';

export default function Index() {
  // We simply redirect to the tabs. 
  // The root _layout.tsx catches this and redirects to login/onboarding if needed.
  return <Redirect href="/(tabs)" />;
}
