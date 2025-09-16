import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet'; 
import { Leaf, BrainCircuit, Bot, Sprout, ShieldCheck, TrendingUp, MapPin, LoaderCircle } from 'lucide-react';
import Footer from './Footer';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
import { Prediction } from './disease_pridiction';
import { CropPrediction } from './Crop';
import Header from './Header';
import { Chatbot } from './ChatBot'; 

// FIX: Default Leaflet icon issue with modern bundlers
// This code ensures that the marker icon images are loaded correctly.
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: iconRetinaUrl,
    iconUrl: iconUrl,
    shadowUrl: shadowUrl,
});
const Benefit = ({ icon, title, description }) => (
    <div className="text-center">
        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-100 text-green-700 mx-auto mb-4">
            {icon}
        </div>
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <p className="text-gray-600 mt-2">{description}</p>
    </div>
);

function LocationPicker({ onLocationSelect }) {
    const map = useMapEvents({
        click(e) {
            onLocationSelect(e.latlng);
            map.flyTo(e.latlng, map.getZoom());
        },
    });
    return null;
}

export default function Landing() {
    const [activeTab, setActiveTab] = useState('recommendation');

    return (
        <div className="bg-gray-50 font-sans antialiased text-gray-900">
            {/* Header */}
            <Header />

            <main>
                {/* Hero Section */}
                <section className="pt-24 md:pt-32 pb-16 md:pb-24 bg-cover  bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1492496913980-501348b61469?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}>
                    <div className="bg-black/50 h-90% w-full pt-16 pb-24  ">
                        <div className="container mx-auto px-6 text-center text-white">
                            <h2 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4">Revolutionize Your Farming with AI</h2>
                            <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto">
                                Get intelligent crop recommendations and instantly detect plant diseases to boost your yield and secure your harvest.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Core Functionality Section */}
                <section id="features" className="py-20 bg-white">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Your Smart Farming Toolkit</h2>
                            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                                Leverage the power of AI to make informed decisions for your farm. Upload an image of a plant leaf or enter your field data to get started.
                            </p>
                        </div>

                        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
                            <div className="flex border-b border-gray-200">
                                <button
                                    onClick={() => setActiveTab('recommendation')}
                                    className={`flex-1 p-4 text-center font-semibold transition-colors duration-300 ${activeTab === 'recommendation' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-green-50'}`}
                                >
                                    <BrainCircuit className="inline-block mr-2 h-5 w-5" /> Crop Recommendation
                                </button>
                                <button
                                    onClick={() => setActiveTab('prediction')}
                                    className={`flex-1 p-4 text-center font-semibold transition-colors duration-300 ${activeTab === 'prediction' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-green-50'}`}
                                >
                                    <Leaf className="inline-block mr-2 h-5 w-5" /> Disease Prediction
                                </button>
                            </div>

                            <div className="p-8 md:p-12">
                                {activeTab === 'recommendation' && (<CropPrediction />)}

                                {activeTab === 'prediction' && <Prediction />}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Why Choose Us Section */}
                <section id="about" className="py-20 bg-gray-50">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">The Future of Farming is Here</h2>
                            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">We combine cutting-edge technology with agricultural science to empower farmers everywhere.</p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-12">
                            <Benefit
                                icon={<TrendingUp size={28} />}
                                title="Boost Your Yield"
                                description="Make data-driven decisions that lead to healthier crops and significantly higher returns."
                            />
                            <Benefit
                                icon={<ShieldCheck size={28} />}
                                title="Early Disease Detection"
                                description="Catch problems early to prevent crop loss and reduce the need for widespread pesticide use."
                            />
                            <Benefit
                                icon={<Bot size={28} />}
                                title="AI-Powered Precision"
                                description="Our smart algorithms provide insights tailored to your farm's unique conditions."
                            />
                        </div>
                    </div>
                </section>
            </main>
            <Footer />

            <Chatbot /> {/* Add the Chatbot component here */}
        </div>
    );
}