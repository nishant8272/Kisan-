// file: app/(tabs)/index.js (Corrected)

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import FeatureButton from '../components/FeatureButton';
import Market from '../components/Market';

export default function HomeScreen() {
  // We will pass this entire block as the header
  const renderHomeScreenHeader = () => (
    <>
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
    </>
  );

  return (
    // No ScrollView! The Market component's FlatList now controls everything.
    <Market ListHeaderComponent={renderHomeScreenHeader()} />
  );
}

const styles = StyleSheet.create({
  // These styles are for the header content we are passing in
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