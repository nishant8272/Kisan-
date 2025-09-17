import React from 'react'
import { useState } from 'react';
import { Sprout, Search, LoaderCircle, TrendingUp, Leaf } from 'lucide-react';


function Market() {
// --- STATE FOR MARKET RATE SECTION ---
    const [searchQuery, setSearchQuery] = useState('');
    const [marketData, setMarketData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);


    // --- MOCK API CALL SIMULATION ---
    // In a real app, this would be a fetch() call to your backend.
        const getMockMarketData = (cropName) => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    if (cropName.toLowerCase() === 'error') {
                        reject('Failed to fetch data. Please try again.');
                    }
                    // Dummy data for demonstration
                    const mockData = {
                        wheat: [
                            { market: 'Meerut Mandi', state: 'Uttar Pradesh', minPrice: 2100, maxPrice: 2250, modalPrice: 2180 },
                            { market: 'Saharanpur Mandi', state: 'Uttar Pradesh', minPrice: 2080, maxPrice: 2200, modalPrice: 2150 },
                            { market: 'Ludhiana Mandi', state: 'Punjab', minPrice: 2150, maxPrice: 2300, modalPrice: 2220 },
                            { market: 'Amritsar Mandi', state: 'Punjab', minPrice: 2120, maxPrice: 2280, modalPrice: 2200 },
                        ],
                        rice: [
                            { market: 'Gorakhpur Mandi', state: 'Uttar Pradesh', minPrice: 3100, maxPrice: 3300, modalPrice: 3220 },
                            { market: 'Varanasi Mandi', state: 'Uttar Pradesh', minPrice: 3050, maxPrice: 3250, modalPrice: 3150 },
                            { market: 'Patiala Mandi', state: 'Punjab', minPrice: 3180, maxPrice: 3380, modalPrice: 3270 },
                            { market: 'Amritsar Mandi', state: 'Punjab', minPrice: 3200, maxPrice: 3400, modalPrice: 3300 },
                        ],
                        sugarcane: [
                            { market: 'Muzaffarnagar Mandi', state: 'Uttar Pradesh', minPrice: 340, maxPrice: 360, modalPrice: 350 },
                            { market: 'Lucknow Mandi', state: 'Uttar Pradesh', minPrice: 330, maxPrice: 345, modalPrice: 338 },
                            { market: 'Gurdaspur Mandi', state: 'Punjab', minPrice: 325, maxPrice: 340, modalPrice: 333 },
                        ],
                        maize: [
                            { market: 'Varanasi Mandi', state: 'Uttar Pradesh', minPrice: 1700, maxPrice: 1850, modalPrice: 1780 },
                            { market: 'Gorakhpur Mandi', state: 'Uttar Pradesh', minPrice: 1650, maxPrice: 1800, modalPrice: 1725 },
                            { market: 'Amritsar Mandi', state: 'Punjab', minPrice: 1680, maxPrice: 1820, modalPrice: 1750 },
                        ],

                        // === Pulses split ===
                        chana: [
                            { market: 'Kanpur Mandi', state: 'Uttar Pradesh', minPrice: 5200, maxPrice: 5500, modalPrice: 5350 },
                            { market: 'Lucknow Mandi', state: 'Uttar Pradesh', minPrice: 5250, maxPrice: 5550, modalPrice: 5400 },
                            { market: 'Amritsar Mandi', state: 'Punjab', minPrice: 5300, maxPrice: 5600, modalPrice: 5450 },
                        ],
                        masoor: [
                            { market: 'Varanasi Mandi', state: 'Uttar Pradesh', minPrice: 5600, maxPrice: 5850, modalPrice: 5720 },
                            { market: 'Ludhiana Mandi', state: 'Punjab', minPrice: 5550, maxPrice: 5800, modalPrice: 5675 },
                        ],
                        arhar: [
                            { market: 'Gorakhpur Mandi', state: 'Uttar Pradesh', minPrice: 6500, maxPrice: 6800, modalPrice: 6650 },
                            { market: 'Amritsar Mandi', state: 'Punjab', minPrice: 6400, maxPrice: 6700, modalPrice: 6550 },
                        ],
                        moong: [
                            { market: 'Lucknow Mandi', state: 'Uttar Pradesh', minPrice: 7200, maxPrice: 7500, modalPrice: 7350 },
                            { market: 'Jalandhar Mandi', state: 'Punjab', minPrice: 7100, maxPrice: 7400, modalPrice: 7250 },
                        ],
                        urad: [
                            { market: 'Kanpur Mandi', state: 'Uttar Pradesh', minPrice: 6800, maxPrice: 7100, modalPrice: 6950 },
                            { market: 'Amritsar Mandi', state: 'Punjab', minPrice: 6700, maxPrice: 7000, modalPrice: 6850 },
                        ],
                    };

                    resolve(mockData[cropName.toLowerCase()] || []);
                }, 1500); // Simulate 1.5 second network delay
            });
        };




     const handleSearch = async (e) => {
            e.preventDefault();
            if (!searchQuery) return;
    
            setIsLoading(true);
            setError(null);
            setMarketData([]);
    
            try {
                const data = await getMockMarketData(searchQuery);
                setMarketData(data);
            } catch (err) {
                setError(err);
            } finally {
                setIsLoading(false);
            }
        };
  return (
    <div>
      <section id="market-rates" className="py-20 bg-gradient-to-b from-green-50 to-white relative">
                    <div className="container mx-auto px-6">
                        {/* Heading */}
                        <div className="text-center mb-12 max-w-3xl mx-auto">
                            <span className="inline-block px-3 py-1 text-sm font-semibold bg-green-100 text-green-700 rounded-full mb-4">
                                🌾 Current Updates
                            </span>
                            <h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-green-700 via-green-500 to-emerald-600 text-transparent bg-clip-text">
                                Agricultural Market Prices
                            </h2>
                            <p className="text-gray-600 mt-4 text-lg">
                                Search for your crop and explore the latest mandi prices across India.
                            </p>

                            {/* Search Input */}
                            <form onSubmit={handleSearch} className="mt-8 flex justify-center max-w-2xl mx-auto">
                                <div className="relative w-full">
                                    <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                                        <Sprout className="h-5 w-5" />
                                    </span>
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Enter crop name... (e.g., Wheat, Rice, Sugarcane)"
                                        className="w-full pl-10 pr-20 py-4 rounded-full border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                                    />
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition disabled:bg-gray-400 flex items-center gap-2"
                                    >
                                        {isLoading ? <LoaderCircle className="animate-spin h-5 w-5" /> : <Search className="h-5 w-5" />}
                                        <span className="hidden md:inline">Search</span>
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Results */}
                        <div className="mt-12">
                            {isLoading && (
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="h-48 bg-gray-200 rounded-xl animate-pulse"></div>
                                    ))}
                                </div>
                            )}

                            {error && (
                                <div className="text-center text-red-600 bg-red-100 p-4 rounded-lg max-w-md mx-auto">
                                    ⚠️ {error}
                                </div>
                            )}

                            {!isLoading && !error && marketData.length > 0 && (
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {marketData.map((data, index) => (
                                        <div
                                            key={index}
                                            className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-2xl hover:scale-[1.02] hover:border-green-500 transition-all duration-300"
                                        >
                                            <h4 className="text-2xl font-bold text-green-800">{data.market}</h4>
                                            <p className="text-sm text-gray-500 mb-4">{data.state}</p>
                                            <div className="space-y-2 text-gray-700">
                                                <div className="flex justify-between">
                                                    <span className="flex items-center gap-2"><TrendingUp className="h-4 w-4 text-gray-400" /> Min Price:</span>
                                                    <span className="font-semibold">₹ {data.minPrice} / Quintal</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="flex items-center gap-2"><TrendingUp className="h-4 w-4 text-gray-400" /> Max Price:</span>
                                                    <span className="font-semibold">₹ {data.maxPrice} / Quintal</span>
                                                </div>
                                                <div className="flex justify-between text-green-700">
                                                    <span className="flex items-center gap-2 font-bold"><Leaf className="h-4 w-4" /> Avg Price:</span>
                                                    <span className="font-bold text-lg">₹ {data.modalPrice} / Quintal</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {!isLoading && !error && marketData.length === 0 && (
                                <div className="text-center text-gray-500 mt-8">
                                    <p className="text-lg">🔍 Search for a crop above to see Current mandi prices.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
    </div>
  )
}

export default Market
