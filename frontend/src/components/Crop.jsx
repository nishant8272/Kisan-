import React, { useState, useEffect } from 'react';
import axios from "axios"
// --- React Leaflet Imports ---
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Import Leaflet's CSS
import L from 'leaflet'; // Import the Leaflet library itself
// --- Lucide React Icon Imports ---
import { CloudCog, LoaderCircle } from 'lucide-react';

// --- Leaflet Icon Fix Imports ---
// This handles a common issue with bundlers like Webpack or Vite
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

// --- Apply the Leaflet Icon Fix ---
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: iconRetinaUrl,
    iconUrl: iconUrl,
    shadowUrl: shadowUrl,
});

// --- Helper Components for the Map ---

// Helper component to handle map clicks and set the location marker
function LocationPicker({ onLocationSelect }) {
    const map = useMapEvents({
        click(e) {
            onLocationSelect(e.latlng); // Pass the latlng object on click
            map.flyTo(e.latlng, map.getZoom()); // Center the map on the clicked location
        },
    });
    return null; // This component does not render anything itself
}

// Helper component to recenter the map view when location changes
function RecenterAutomatically({ location }) {
    const map = useMap();
    useEffect(() => {
        if (location) {
            map.flyTo([location.latitude, location.longitude], map.getZoom());
        }
    }, [location, map]);
    return null;
}

// --- Main Component ---
export function CropPrediction() {
    const [location, setLocation] = useState(null); // Will store { latitude, longitude }
    const [isLocating, setIsLocating] = useState(false);
    const [locationError, setLocationError] = useState('');
    const [recommendations, setRecommendations] = useState(null);
    const [isLoadingRecs, setIsLoadingRecs] = useState(false);

    // Default map center (Meerut, India)
    const defaultPosition = [28.9845, 77.7064];

    const handleGetCurrentLocation = () => {
        setIsLocating(true);
        setLocationError('');
        setLocation(null);
        setRecommendations(null); // Clear previous recommendations

        if (!navigator.geolocation) {
            setLocationError('Geolocation is not supported by your browser.');
            setIsLocating(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setLocation({ latitude, longitude });
                setIsLocating(false);
            },
            (error) => {
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        setLocationError("Location access denied. Please enable it in your browser settings.");
                        break;
                    case error.POSITION_UNAVAILABLE:
                        setLocationError("Location information is currently unavailable.");
                        break;
                    case error.TIMEOUT:
                        setLocationError("The request to get user location timed out.");
                        break;
                    default:
                        setLocationError("An unknown error occurred while fetching location.");
                        break;
                }
                setIsLocating(false);
            }
        );
    }; ``

    const handleMapClick = (latlng) => {
        // latlng from leaflet is an object { lat, lng }. Convert to our format.
        setLocation({ latitude: latlng.lat, longitude: latlng.lng });
        setRecommendations(null); // Clear old recommendations on new location
    };



    // --- SUBMIT HANDLER to get recommendations ---
    const handleGetRecommendations = async () => {
        if (!location) return;
        setIsLoadingRecs(true);
        setRecommendations(null);
        try {

            // get location 
            const response = await axios.get("http://localhost:3000/api/reverse-geocode", {
                params: { lat: location.latitude, lon: location.longitude }
            });
            console.log(response.data)

            const apiResponse = await axios.get("http://localhost:3000/api/v1/crop_prediction", {
                params: { dist: response.data.address.state_district } // pass district from reverse geocode
            });

            console.log("Prediction API response:", apiResponse.data);

            const recommendedCrop = apiResponse.data.crop;

            // Simulate an API call to a backend AI model
            setTimeout(() => {
                // In a real app, this data would come from your backend based on the location
                const fetchedRecs = [
                    { crop: recommendedCrop, suitability: 'Recommended', reason: 'Based on AI prediction using soil and weather data.' }
                ];
                setRecommendations(fetchedRecs);
                setIsLoadingRecs(false);
            }, 1500); // Simulate a 1.5-second network delay
        }catch (error) {
            console.error("Error fetching recommendations:", error.message);
        } finally {
            setIsLoadingRecs(false);
        }
    };

    return (
        <div className="w-full">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Find the Perfect Crop for Your Land</h3>
            <p className="text-gray-600 mb-6">
                Our AI analyzes soil and weather data based on your selected location to recommend the most profitable and suitable crops. Maximize your yield and minimize risks.
            </p>

            {/* --- Interactive Map Integration --- */}
            <div className="relative w-full h-80 md:h-96 bg-gray-200 rounded-lg mb-4 overflow-hidden border-2 border-gray-300">
                <MapContainer
                    center={defaultPosition}
                    zoom={13}
                    style={{ height: '100%', width: '100%' }}
                    className="z-0"
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationPicker onLocationSelect={handleMapClick} />
                    {location && (
                        <Marker position={[location.latitude, location.longitude]} />
                    )}
                    <RecenterAutomatically location={location} />
                </MapContainer>

                <div className="absolute top-2 left-2 right-2 bg-white/80 p-2 rounded-md shadow-lg text-center pointer-events-none z-10">
                    <p className="text-gray-800 font-semibold">
                        {location ? 'Location Captured!' : "Click on the map to select your farm's location"}
                    </p>
                    {location && (
                        <p className="text-sm text-gray-600 mt-1">
                            {`Lat: ${location.latitude.toFixed(4)}, Lon: ${location.longitude.toFixed(4)}`}
                        </p>
                    )}
                </div>
            </div>
            <button
                onClick={handleGetCurrentLocation}
                disabled={isLocating}
                className="w-full mb-2 bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 flex items-center justify-center"
            >
                {isLocating ? (
                    <>
                        <LoaderCircle className="animate-spin mr-2 h-5 w-5" />
                        Fetching Location...
                    </>
                ) : (
                    'Use My Current Location'
                )}
            </button>
            {locationError && <p className="text-red-500 text-sm text-center my-2">{locationError}</p>}

            <button
                onClick={handleGetRecommendations}
                className="w-full mt-2 bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                disabled={!location || isLoadingRecs}
            >
                {isLoadingRecs ? (
                    <>
                        <LoaderCircle className="animate-spin mr-2 h-5 w-5" />
                        Analyzing...
                    </>
                ) : (
                    'Get Recommendations'
                )}
            </button>

            {/* --- NEW: Recommendation Results Display --- */}
            {recommendations && (
                <div className="mt-8">
                    <h4 className="text-xl font-bold text-gray-800 mb-4 text-left">Top Crop Recommendations</h4>
                    <div className="space-y-4">
                        {recommendations.map((rec) => (
                            <div key={rec.crop} className="bg-gray-50 border border-gray-200 p-4 rounded-lg text-left">
                                <div className="flex justify-between items-center">
                                    <h5 className="text-lg font-semibold text-gray-900">{rec.crop}</h5>
                                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${rec.suitability === 'Excellent' ? 'bg-green-100 text-green-800' :
                                            rec.suitability === 'Good' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {rec.suitability}
                                    </span>
                                </div>
                                <p className="text-gray-600 mt-2">{rec.reason}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}