// file: app/(tabs)/index.js
import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import FeatureButton from '../components/FeatureButton';

export default function HomeScreen() {
  const theme = useTheme();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>Welcome, Farmer!</Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Your smart assistant for a better harvest.
        </Text>
      </View>

      <FeatureButton
        title="Crop Prediction"
        iconName="barley"
        description="Get recommendations for the best crop to grow."
        href="/crop-prediction"
      />

      <FeatureButton
        title="Disease Detection"
        iconName="leaf"
        description="Upload a photo to detect crop diseases instantly."
        href="/disease-detection"
      />

      <FeatureButton
        title="Ask Chat Assistant"
        iconName="chat-question"
        description="Get answers to your farming questions."
        href="/chatbot"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontWeight: '700',
  },
  subtitle: {
    marginTop: 8,
    textAlign: 'center',
  },
});