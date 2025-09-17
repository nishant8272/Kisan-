// file: app/crop-prediction.js
import React,{useState} from 'react';
import { StyleSheet, ScrollView, View, Alert } from 'react-native';
import { Button, Card, Text, ActivityIndicator, useTheme } from 'react-native-paper';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';

// IMPORTANT: Replace with your computer's local IP address and port.
const API_URL = 'http://192.168.84.231:3000'; 

export default function CropPredictionScreen() {
    const [location, setLocation] = useState(null);
    const [isLocating, setIsLocating] = useState(false);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const theme = useTheme();

    const initialRegion = {
        latitude: 28.9845,
        longitude: 77.7064,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    };

    const handleGetCurrentLocation = async () => {
        setIsLocating(true);
        setResult(null);
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Permission to access location was denied.');
            setIsLocating(false);
            return;
        }
        try {
            const position = await Location.getCurrentPositionAsync({});
            setLocation(position.coords);
        } catch (error) {
            Alert.alert('Error', 'Could not fetch your current location.');
        } finally {
            setIsLocating(false);
        }
    };
    
    const handleMapPress = (e) => {
        const { latitude, longitude } = e.nativeEvent.coordinate;
        setLocation({ latitude, longitude });
        setResult(null);
    };

    const handlePredict = async () => {
        if (!location) {
            Alert.alert('Location Needed', 'Please select a location on the map or use your current location first.');
            return;
        }
        setLoading(true);
        setResult(null);
    
        try {
            console.log("1. Starting prediction for:", location);
    
            const geoResponse = await fetch(`${API_URL}/api/reverse-geocode?lat=${location.latitude}&lon=${location.longitude}`);
            console.log("2. Geo response status:", geoResponse.status);
            if (!geoResponse.ok) throw new Error(`Could not get location details. Server responded with ${geoResponse.status}`);
            
            const geoData = await geoResponse.json();
            console.log("3. Geo data received:", JSON.stringify(geoData, null, 2));
            
            const district = geoData?.address?.state_district;
            console.log("4. Extracted district:", district);
            if (!district) throw new Error('Could not determine the district from the location data.');
    
            const cropResponse = await fetch(`${API_URL}/api/v1/crop_prediction?dist=${district}`);
            console.log("5. Crop response status:", cropResponse.status);
            if (!cropResponse.ok) throw new Error(`Failed to get crop prediction. Server responded with ${cropResponse.status}`);
            
            const predictionData = await cropResponse.json();
            console.log("6. Prediction data received:", JSON.stringify(predictionData, null, 2));
    
            // --- NEW: DATA TRANSFORMATION ---
            const cropString = predictionData.crop || "";
            const cropsArray = cropString.split(',').map(crop => crop.trim());
    
            const formattedResult = {
                recommendations: cropsArray.map(cropName => ({
                    crop: cropName,
                    reason: `Suitable for ${district} based on soil and climate data.`
                }))
            };
            // ---------------------------------
            
            setResult(formattedResult);
            console.log("7. Success! Result has been set.");
    
        } catch (error) {
            console.error("PREDICTION FAILED:", error); 
            Alert.alert('Prediction Failed', error.message);
        } finally {
            console.log("8. Prediction process finished. Stopping loader.");
            setLoading(false);
        }
    };
    
    return (
        <ScrollView
            style={[styles.container, { backgroundColor: theme.colors.background }]}
            contentContainerStyle={styles.contentContainer}
        >
            <Card style={styles.card}>
                <Card.Title title="Select Your Farm's Location" />
                <Card.Content>
                    <Text style={styles.instructions}>
                        Use your current location or tap on the map to place a marker.
                    </Text>
                    <View style={styles.mapContainer}>
                        <MapView
                            style={styles.map}
                            initialRegion={initialRegion}
                            onPress={handleMapPress}
                        >
                            {location && <Marker coordinate={location} />}
                        </MapView>
                    </View>
                    {location && (
                        <Text style={styles.locationText}>
                            Lat: {location.latitude.toFixed(4)}, Lon: {location.longitude.toFixed(4)}
                        </Text>
                    )}
                    <Button
                        mode="contained-tonal"
                        onPress={handleGetCurrentLocation}
                        loading={isLocating}
                        disabled={isLocating || loading}
                        style={styles.button}
                        icon="crosshairs-gps"
                    >
                        Use My Current Location
                    </Button>
                    <Button
                        mode="contained"
                        onPress={handlePredict}
                        disabled={!location || loading}
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
                    <Card.Title title="Top Crop Recommendations" titleVariant="titleLarge" />
                    <Card.Content>
                        {result.recommendations.map((rec, index) => (
                            <View key={index} style={styles.recItem}>
                                <Text style={styles.recCrop}>{rec.crop}</Text>
                                <Text style={styles.recReason}>{rec.reason}</Text>
                            </View>
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
    card: { marginBottom: 20 },
    instructions: { marginBottom: 16, textAlign: 'center' },
    mapContainer: {
        height: 300,
        borderRadius: 8,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 12,
    },
    map: { flex: 1 },
    locationText: {
        textAlign: 'center',
        marginBottom: 12,
        fontWeight: 'bold',
        fontSize: 16,
    },
    button: { marginTop: 10, paddingVertical: 4 },
    loader: { marginVertical: 20 },
    resultCard: { marginTop: 10 },
    recItem: {
        marginBottom: 12,
        padding: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#eee'
    },
    recCrop: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2E7D32'
    },
    recReason: {
        fontSize: 14,
        marginTop: 4
    },
});