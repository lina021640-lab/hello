import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from '../src/theme';

function Inner() {
  const { t } = useTheme();
  return (
    <>
      <StatusBar style={t.mode === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: t.bg }, animation: 'slide_from_right' }}>
        <Stack.Screen name="schedule/members" options={{ presentation: 'transparentModal', animation: 'fade', contentStyle: { backgroundColor: 'transparent' } }} />
        <Stack.Screen name="schedule/manage" options={{ presentation: 'transparentModal', animation: 'fade', contentStyle: { backgroundColor: 'transparent' } }} />
      </Stack>
    </>
  );
}
export default function Root() {
  const [loaded] = useFonts({
    'Paperlogy-4Regular': require('../assets/fonts/Paperlogy-4Regular.ttf'),
    'Paperlogy-5Medium': require('../assets/fonts/Paperlogy-5Medium.ttf'),
    'Paperlogy-6SemiBold': require('../assets/fonts/Paperlogy-6SemiBold.ttf'),
  });
  if (!loaded) return null;
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <Inner />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
