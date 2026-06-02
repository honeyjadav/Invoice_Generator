import { Stack } from 'expo-router';
import { initializeDatabase } from '../database/schema';

// Run once on app start
initializeDatabase();

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}