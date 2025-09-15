// file: app/disease-detection.js
import React, { useState } from 'react';
import { View, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import { Button, Card, Text, ActivityIndicator, useTheme } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { detectDisease } from './api/mockApi';

export default function DiseaseDetectionScreen() {
  const [imageUri, setImageUri] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const theme = useTheme();

  const pickImage = async (useCamera) => {
    let permissionResult;
    if (useCamera) {
      permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    } else {
      permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    }

    if (permissionResult.granted === false) {
      Alert.alert("Permission required", "You need to grant permission to access the camera/gallery.");
      return;
    }

    const pickerResult = useCamera
      ? await ImagePicker.launchCameraAsync({ aspect: [4, 3], quality: 0.5 })
      : await ImagePicker.launchImageLibraryAsync({ aspect: [4, 3], quality: 0.5 });
      
    if (!pickerResult.canceled) {
      setImageUri(pickerResult.assets[0].uri);
      setResult(null); // Clear previous results
    }
  };

  const handleDetect = async () => {
    if (!imageUri) {
      Alert.alert('No Image', 'Please select an image first.');
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const detection = await detectDisease(imageUri);
      setResult(detection);
    } catch (error) {
      Alert.alert('Detection Failed', 'Could not analyze the image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <Card>
        <Card.Content>
          <Text variant="titleMedium" style={styles.instructions}>
            Upload a photo of the affected crop leaf.
          </Text>
          <View style={styles.buttonContainer}>
            <Button icon="camera" mode="contained-tonal" onPress={() => pickImage(true)} style={styles.button}>
              Camera
            </Button>
            <Button icon="image-multiple" mode="contained-tonal" onPress={() => pickImage(false)} style={styles.button}>
              Gallery
            </Button>
          </View>

          {imageUri && (
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: imageUri }} style={styles.imagePreview} />
              <Button
                mode="contained"
                onPress={handleDetect}
                disabled={loading}
                icon="magnify"
                style={styles.detectButton}
              >
                Detect Disease
              </Button>
            </View>
          )}
        </Card.Content>
      </Card>

      {loading && <ActivityIndicator animating={true} size="large" style={styles.loader} />}

      {result && (
        <Card style={styles.resultCard}>
          <Card.Cover source={result.detectedImage} />
          <Card.Title
            title={result.diseaseName}
            subtitle={`Confidence: ${result.confidence}`}
            titleVariant="headlineSmall"
          />
          <Card.Content>
            <Text variant="titleMedium">Severity: {result.severity}</Text>
            <Text variant="titleMedium" style={styles.tipsTitle}>Treatment Advice:</Text>
            {result.treatment.map((tip, index) => (
              <Text key={index} style={styles.tipText}>{`\u2022 ${tip}`}</Text>
            ))}
          </Card.Content>
        </Card>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentContainer: { padding: 16 },
  instructions: { textAlign: 'center', marginBottom: 16 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-around' },
  button: { flex: 1, marginHorizontal: 4 },
  imagePreviewContainer: { alignItems: 'center', marginTop: 20 },
  imagePreview: { width: '100%', height: 250, borderRadius: 8, marginBottom: 16 },
  detectButton: { width: '100%' },
  loader: { marginVertical: 20 },
  resultCard: { marginTop: 20 },
  tipsTitle: { marginTop: 16, marginBottom: 8, fontWeight: 'bold' },
  tipText: { marginBottom: 5, lineHeight: 22 },
});