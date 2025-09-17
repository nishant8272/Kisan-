// file: app/_layout.js
import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { theme } from './theme/theme';

export default function RootLayout() {
  return (
    <PaperProvider theme={theme}>
      {/* The Stack component defines the navigation structure */}
      <Stack>
        {/* The main tab navigator is defined here */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        {/* Screens outside the tab bar are defined next */}
        <Stack.Screen
          name="crop-prediction"
          options={{
            title: 'Crop Prediction',
            headerStyle: { backgroundColor: theme.colors.primary },
            headerTintColor: '#fff',
          }}
        />
        <Stack.Screen
          name="disease-detection"
          options={{
            title: 'Disease Detection',
            headerStyle: { backgroundColor: theme.colors.primary },
            headerTintColor: '#fff',
          }}
        />
      </Stack>
    </PaperProvider>
  );
}