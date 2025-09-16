// file: app/crop-prediction.js
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { TextInput, Button, Card, Text, ActivityIndicator, useTheme } from 'react-native-paper';
import { predictCrop } from './api/mockApi';

export default function CropPredictionScreen() {
  const [soil, setSoil] = useState('');
  const [rainfall, setRainfall] = useState('');
  const [temperature, setTemperature] = useState('');
  const [region, setRegion] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const theme = useTheme();

  const handlePredict = async () => {
    if (!soil || !rainfall || !temperature || !region) {
      alert('Please fill in all fields.');
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const prediction = await predictCrop({ soil, rainfall, temperature, region });
      setResult(prediction);
    } catch (error) {
      alert('Failed to get prediction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <Card style={styles.card}>
        <Card.Title title="Enter Farm Conditions" />
        <Card.Content>
          <TextInput
            label="Soil Type (e.g., Loamy, Clay)"
            value={soil}
            onChangeText={setSoil}
            style={styles.input}
            mode="outlined"
          />
          <TextInput
            label="Annual Rainfall (in mm)"
            value={rainfall}
            onChangeText={setRainfall}
            style={styles.input}
            keyboardType="numeric"
            mode="outlined"
          />
          <TextInput
            label="Temperature (in °C)"
            value={temperature}
            onChangeText={setTemperature}
            style={styles.input}
            keyboardType="numeric"
            mode="outlined"
          />
          <TextInput
            label="Region / Area"
            value={region}
            onChangeText={setRegion}
            style={styles.input}
            mode="outlined"
          />
          <Button
            mode="contained"
            onPress={handlePredict}
            disabled={loading}
            style={styles.button}
            icon="barley"
          >
            Predict Crop
          </Button>
        </Card.Content>
      </Card>

      {loading && <ActivityIndicator animating={true} size="large" style={styles.loader} />}

      {result && (
        <Card style={styles.resultCard}>
          <Card.Cover source={result.image} />
          <Card.Title title={`Recommended Crop: ${result.cropName}`} titleVariant="titleLarge" />
          <Card.Content>
            <Text variant="titleMedium" style={styles.tipsTitle}>Farming Tips:</Text>
            {result.tips.map((tip, index) => (
              <Text key={index} style={styles.tipText}>{`\u2022 ${tip}`}</Text>
            ))}
          </Card.Content>
        </Card>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  card: {
    marginBottom: 20,
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginTop: 10,
    paddingVertical: 8,
  },
  loader: {
    marginVertical: 20,
  },
  resultCard: {
    marginTop: 20,
  },
  tipsTitle: {
    marginTop: 10,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  tipText: {
    marginBottom: 5,
    lineHeight: 20,
  },
});