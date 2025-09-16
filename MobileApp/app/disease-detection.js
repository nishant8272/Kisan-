// file: app/disease-detection.js
import React, { useState } from 'react';
import { View, StyleSheet, Image, ScrollView, Alert, Platform } from 'react-native';
import { Button, Card, Text, ActivityIndicator, useTheme } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';

// IMPORTANT: Replace with your computer's local IP address.
// On Windows, run `ipconfig` in cmd. On Mac/Linux, run `ifconfig` in terminal.

const API_URL = 'http://192.168.84.231:3000';
 // Example: 'http://192.168.1.5:3000'

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

  /**
   * This is the updated function to handle the image upload to your backend.
   */
  const handleDetect = async () => {
    if (!imageUri) {
      Alert.alert('No Image', 'Please select an image first.');
      return;
    }
    setLoading(true);
    setResult(null);

    // Create FormData to send the image
    const formData = new FormData();
    const filename = imageUri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image`;

    // The backend expects the file key to be 'image' as per upload.single('image')
    formData.append('image', { uri: imageUri, name: filename, type });

    try {
      const response = await fetch(`${API_URL}/api/v1/diseasePredict`, {
        method: 'POST',
        body: formData,
        // Do not set Content-Type manually; let fetch add the correct boundary
      });

      const data = await response.json();

      if (!response.ok) {
        // If server returns a known error structure, display it
        throw new Error(data.error || 'Something went wrong');
      }
      
      // The actual prediction is nested in the 'prediction' object
      setResult(data.prediction);

    } catch (error) {
      console.error('Detection error:', error);
      Alert.alert('Detection Failed', error.message);
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

      {/* This section now uses imageUri for the cover image */}
      {result && imageUri && (
        <Card style={styles.resultCard}>
          <Card.Cover source={{ uri: imageUri }} />
          <Card.Title
            title={result.predicted_class || 'Unknown Disease'}
            subtitle={result.confidence ? `Confidence: ${(result.confidence * 100).toFixed(2)}%` : ''}
            titleVariant="headlineSmall"
          />
           {/* You might need to adjust the fields below based on your ML model's output */}
          <Card.Content>
            <Text variant="titleMedium" style={styles.tipsTitle}>Details:</Text>
            <Text style={styles.tipText}>{`\u2022 This appears to be ${result.predicted_class}.`}</Text>
            {/* Add more details from your result object if available */}
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