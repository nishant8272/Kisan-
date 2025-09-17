// file: app/theme/theme.js
import { MD3LightTheme as DefaultTheme } from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#2E7D32',      // A deep, trustworthy green
    secondary: '#558B2F',    // A lighter, earthy green
    tertiary: '#9E9D24',     // A lime/olive green
    background: '#F1F8E9',    // A very light green, easy on the eyes
    surface: '#FFFFFF',       // White for cards and surfaces
    accent: '#FFC107',        // A pop of amber/yellow for accents
    error: '#D32F2F',         // Standard error red
    text: '#212121',          // Dark grey for text
    onSurface: '#212121',
    primaryContainer: '#C8E6C9', // Lighter shade for containers
    secondaryContainer: '#DCEDC8',
  },
};