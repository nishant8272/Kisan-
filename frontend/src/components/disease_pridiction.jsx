import React, { useState } from "react";
import { Leaf, UploadCloud, X, LoaderCircle } from "lucide-react";

export function Prediction() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState(null);
    const API_BASE_URL = 'http://localhost:3000';


    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith("image/")) {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
            setResult(null);
        } else {
            alert("Please select an image file (PNG, JPG, JPEG).");
        }
    };

    // Clears the selected file and its preview
    const clearSelection = () => {
        setSelectedFile(null);
        setPreview(null);
        setResult(null);
    };

    const handleDragOver = (e) => {
        e.preventDefault(); 
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith("image/")) {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
            setResult(null);
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedFile) {
            alert("Please select a file to predict.");
            return;
        }
        setIsLoading(true);
        setResult(null);

        try {
            const formData = new FormData();
            formData.append('image', selectedFile);

            const response = await fetch(`${API_BASE_URL}/api/v1/diseasePredict`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to get prediction');
            }

            if (data.success && data.prediction) {
                const prediction = data.prediction;
                setResult({
                    disease: prediction.predicted_class || 'Unknown Disease',
                    confidence: `${(prediction.confidence * 100).toFixed(1)}%`,
                    recommendation: getRecommendation(prediction.predicted_class, prediction.confidence)
                });
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error) {
            console.error('Prediction error:', error);
            setResult({
                disease: 'Error',
                confidence: '0%',
                recommendation: `Failed to analyze image: ${error.message}. Please try again with a different image.`
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Helper function to provide recommendations based on disease prediction
    const getRecommendation = (disease, confidence) => {
        if (confidence < 0.5) {
            return "Low confidence prediction. Please ensure the image shows a clear view of the plant leaf and try again.";
        }

        const recommendations = {
            'Tomato_Bacterial_spot': 'Apply copper-based fungicides and ensure proper plant spacing for air circulation. Remove affected leaves and avoid overhead watering.',
            'Tomato_Early_blight': 'Use fungicides containing chlorothalonil or mancozeb. Improve air circulation and avoid wetting leaves during watering.',
            'Tomato_Late_blight': 'Apply fungicides immediately. Remove and destroy affected plants. Ensure good drainage and air circulation.',
            'Tomato_Leaf_Mold': 'Improve air circulation, reduce humidity, and apply fungicides. Remove affected leaves and avoid overhead watering.',
            'Tomato_Septoria_leaf_spot': 'Apply fungicides and remove affected leaves. Ensure proper plant spacing and avoid overhead watering.',
            'Tomato_Spider_mites_Two_spotted_spider_mite': 'Use insecticidal soap or neem oil. Increase humidity and ensure plants are well-watered.',
            'Tomato_Target_Spot': 'Apply fungicides and improve air circulation. Remove affected leaves and avoid overhead watering.',
            'Tomato_Yellow_Leaf_Curl_Virus': 'Remove and destroy affected plants. Control whitefly populations and use virus-resistant varieties.',
            'Tomato_mosaic_virus': 'Remove and destroy affected plants. Control aphids and use virus-resistant varieties. Disinfect tools between plants.',
            'Tomato_healthy': 'Your plant appears healthy! Continue with regular care including proper watering, fertilization, and monitoring for pests.'
        };

        return recommendations[disease] || `Disease detected: ${disease}. Please consult with a local agricultural extension service for specific treatment recommendations.`;
    };


    return (
        <form onSubmit={handleSubmit} className="text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Instantly Identify Plant Diseases</h3>
            <p className="text-gray-600 mb-6 max-w-xl mx-auto">
                Upload a clear photo of a plant's leaf, and our advanced image recognition model will detect potential diseases, providing you with early warnings and treatment advice.
            </p>
            
            {isLoading && (
                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-blue-800 font-medium">
                        🔬 Analyzing your image... This may take a few moments.
                    </p>
                </div>
            )}

            {/* File Input & Dropzone */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative border-4 border-dashed rounded-2xl p-8 transition-colors ${
                    isDragging ? 'border-green-600 bg-green-50' : 'border-gray-300 hover:border-green-500'
                }`}
            >
                {/* Image Preview*/}
                {preview ? (
                    <>
                        <img src={preview} alt="Selected leaf" className="w-full h-48 object-contain mx-auto rounded-md" />
                        <button
                            type="button"
                            onClick={clearSelection}
                            className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-md hover:bg-red-100 text-gray-600 hover:text-red-600 transition-colors"
                            aria-label="Clear selection"
                        >
                            <X size={20} />
                        </button>
                    </>
                ) : (
                    <>
                        <UploadCloud className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-700 font-semibold mb-2">Drag & drop a file here or</p>
                        <label htmlFor="file-upload" className="text-green-600 font-bold cursor-pointer hover:underline">
                            Choose a file
                        </label>
                    </>
                )}
                <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} accept="image/png, image/jpeg, image/jpg" />
            </div>
            {selectedFile && !result && (
                <p className="text-sm text-gray-500 mt-3">
                    File selected: <strong>{selectedFile.name}</strong>
                </p>
            )}

            {/* Submit Button */}
            <button
                type="submit"
                disabled={!selectedFile || isLoading}
                className="w-full mt-6 bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
                {isLoading ? (
                    <>
                        <LoaderCircle className="animate-spin mr-2" />
                        Analyzing...
                    </>
                ) : (
                    'Get Prediction'
                )}
            </button>
            
            {/* Result Display */}
            {result && (
                <div className={`mt-8 text-left p-6 rounded-lg border ${
                    result.disease === 'Error' 
                        ? 'bg-red-50 border-red-200' 
                        : result.disease === 'Tomato_healthy'
                        ? 'bg-green-50 border-green-200'
                        : 'bg-yellow-50 border-yellow-200'
                }`}>
                    <h4 className="text-xl font-bold text-gray-800 flex items-center">
                        <Leaf className="mr-2" size={24} />
                        {result.disease === 'Error' ? 'Analysis Failed' : 'Prediction Result'}
                    </h4>
                    <p className="mt-2">
                        <strong>Disease:</strong> 
                        <span className={`font-semibold ml-2 ${
                            result.disease === 'Error' 
                                ? 'text-red-600' 
                                : result.disease === 'Tomato_healthy'
                                ? 'text-green-600'
                                : 'text-orange-600'
                        }`}>
                            {result.disease === 'Tomato_healthy' ? 'Healthy Plant' : result.disease}
                        </span>
                    </p>
                    <p className="mt-1">
                        <strong>Confidence:</strong> 
                        <span className={`ml-2 font-semibold ${
                            parseFloat(result.confidence) >= 80 ? 'text-green-600' :
                            parseFloat(result.confidence) >= 60 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                            {result.confidence}
                        </span>
                    </p>
                    <div className="mt-4">
                        <p className="font-semibold text-gray-700 mb-2">
                            {result.disease === 'Error' ? 'Error Details:' : 'Recommendation:'}
                        </p>
                        <p className="text-gray-600 leading-relaxed">{result.recommendation}</p>
                    </div>
                </div>
            )}
        </form>
    );
}