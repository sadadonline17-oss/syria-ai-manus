import '@/global.css';

import { IMPERIAL, NAV_THEME } from '@/lib/theme';
import { ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { I18nManager } from 'react-native';
import { ErrorBoundary } from './error-boundary';

I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <ThemeProvider value={NAV_THEME.dark}>
        <StatusBar style="light" backgroundColor={IMPERIAL.background} />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: IMPERIAL.background } }} />
      </ThemeProvider>
    </ErrorBoundary>
  );
}
