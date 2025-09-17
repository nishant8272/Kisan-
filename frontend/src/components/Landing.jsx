import { motion } from "framer-motion";  // ✅ Move it here
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Leaf, BrainCircuit, Bot, Sprout, ShieldCheck, TrendingUp, MapPin, Search, LoaderCircle } from 'lucide-react';
import Footer from './Footer';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
import { Prediction } from './disease_pridiction';
import { CropPrediction } from './Crop';
import Header from './Header';
import { Chatbot } from './ChatBot';
import Market from './Market';

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

const MarketRateCard = ({ market, state, minPrice, maxPrice, modalPrice }) => (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg hover:border-green-500 transition-all duration-300">
        <h4 className="text-xl font-bold text-green-800">{market}</h4>
        <p className="text-sm text-gray-500 mb-4">{state}</p>
        <div className="space-y-2 text-gray-700">
            <div className="flex justify-between">
                <span>Min Price:</span>
                <span className="font-semibold">₹ {minPrice} / Quintal</span>
            </div>
            <div className="flex justify-between">
                <span>Max Price:</span>
                <span className="font-semibold">₹ {maxPrice} / Quintal</span>
            </div>
            <div className="flex justify-between text-green-700">
                <span className="font-bold">Avg Price:</span>
                <span className="font-bold text-lg">₹ {modalPrice} / Quintal</span>
            </div>
        </div>
    </div>
);

export default function Landing() {
    const [activeTab, setActiveTab] = useState('recommendation');

    
   

    return (
        <div className="bg-gray-50 font-sans antialiased text-gray-900">
            {/* Header */}
            <Header />

            <main>
                {/* Hero Section */}

                <section
                    className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
                    style={{
                        backgroundImage:
                            "url('https://images.unsplash.com/photo-1492496913980-501348b61469?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3')",
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70"></div>

                    <div className="relative z-10 text-center text-white px-6">
                        <motion.h2
                            initial={{ opacity: 0, y: -50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1 }}
                            className="text-4xl md:text-6xl font-extrabold leading-tight mb-6"
                        >
                            Revolutionize Your Farming with{" "}
                            <span className="bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                                AI
                            </span>
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1.2, delay: 0.3 }}
                            className="text-lg md:text-xl mb-10 max-w-3xl mx-auto text-gray-200"
                        >
                            Get intelligent crop recommendations and instantly detect plant
                            diseases to boost your yield and secure your harvest.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1.5, delay: 0.6 }}
                        >
                            <a
                                href="#features"
                                className="px-8 py-4 text-lg font-semibold rounded-full bg-green-600 hover:bg-green-700 transition-all shadow-lg hover:shadow-green-500/40"
                            >
                                🚀 Get Started
                            </a>
                        </motion.div>
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

                {/* ===== BEAUTIFIED MARKET RATE SECTION ===== */}
                <Market/>

                {/* Why Choose Us Section */}
                <section id="about" className="py-20 bg-gradient-to-r from-green-50 via-white to-green-50">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">
                                The Future of Farming is <span className="text-green-600">Here</span>
                            </h2>
                            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                                We combine cutting-edge technology with agricultural science to empower farmers everywhere.
                            </p>
                        </div>

                        {/* Benefits Grid */}
                        <div className="grid md:grid-cols-3 gap-10">
                            <div className="bg-white/70 backdrop-blur-md shadow-xl rounded-2xl p-8 text-center transform hover:scale-105 hover:shadow-2xl transition duration-300 ease-in-out">
                                <div className="flex justify-center items-center w-16 h-16 mx-auto mb-6 rounded-full bg-green-100 text-green-600">
                                    <TrendingUp size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-3">Boost Your Yield</h3>
                                <p className="text-gray-600">Make data-driven decisions that lead to healthier crops and significantly higher returns.</p>
                            </div>

                            <div className="bg-white/70 backdrop-blur-md shadow-xl rounded-2xl p-8 text-center transform hover:scale-105 hover:shadow-2xl transition duration-300 ease-in-out">
                                <div className="flex justify-center items-center w-16 h-16 mx-auto mb-6 rounded-full bg-blue-100 text-blue-600">
                                    <ShieldCheck size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-3">Early Disease Detection</h3>
                                <p className="text-gray-600">Catch problems early to prevent crop loss and reduce the need for widespread pesticide use.</p>
                            </div>

                            <div className="bg-white/70 backdrop-blur-md shadow-xl rounded-2xl p-8 text-center transform hover:scale-105 hover:shadow-2xl transition duration-300 ease-in-out">
                                <div className="flex justify-center items-center w-16 h-16 mx-auto mb-6 rounded-full bg-purple-100 text-purple-600">
                                    <Bot size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-3">AI-Powered Precision</h3>
                                <p className="text-gray-600">Our smart algorithms provide insights tailored to your farm's unique conditions.</p>
                            </div>
                        </div>
                    </div>
                </section>

            </main>
            <Footer />

            <Chatbot /> {/* Add the Chatbot component here */}
        </div>
    );
}