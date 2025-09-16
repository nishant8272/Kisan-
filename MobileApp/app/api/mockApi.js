// file: app/api/mockApi.js

// A map to associate crop names with local images
const cropImages = {
    Rice: require('../assets/images/rice.jpg'),
    Wheat: require('../assets/images/wheat.jpg'),
    Corn: require('../assets/images/corn.jpg'),
  };
  
  const diseaseImage = require('../assets/images/leaf_spot.jpg');
  
  /**
   * Simulates a network request
   * @param {number} duration - The delay in milliseconds
   */
  const networkDelay = (duration) => new Promise(resolve => setTimeout(resolve, duration));
  
  /**
   * Mock API to predict the best crop.
   * @param {object} data - { soil, rainfall, temperature, region }
   * @returns {Promise<object>} - A promise that resolves with the crop prediction result.
   */
  export const predictCrop = async ({ soil, rainfall }) => {
    await networkDelay(1500); // Simulate 1.5 second API call
  
    // Simple mock logic: Different crops for different soil types
    if (soil.toLowerCase().includes('loamy')) {
      return {
        cropName: 'Wheat',
        image: cropImages['Wheat'],
        tips: [
          'Ensure proper irrigation during the crown root initiation stage.',
          'Use a nitrogen-rich fertilizer for better yield.',
          'Harvest when the grain is hard and the straw is dry.',
        ],
      };
    } else if (soil.toLowerCase().includes('clay')) {
      return {
        cropName: 'Rice',
        image: cropImages['Rice'],
        tips: [
          'Requires flooded conditions for most of its growth cycle.',
          'Monitor for pests like stem borer and leafhopper.',
          'Use balanced fertilizers (NPK) as per soil test results.',
        ],
      };
    } else {
      return {
        cropName: 'Corn',
        image: cropImages['Corn'],
        tips: [
          'Plant in well-drained soil with good sun exposure.',
          'Sensitive to frost; plant after the last frost date.',
          'Requires significant nitrogen, especially during early growth.',
        ],
      };
    }
  };
  
  /**
   * Mock API to detect crop disease from an image.
   * @param {string} imageUri - The URI of the image to analyze.
   * @returns {Promise<object>} - A promise that resolves with the disease detection result.
   */
  export const detectDisease = async (imageUri) => {
    await networkDelay(2000); // Simulate a 2 second image processing call
  
    // In a real app, you would upload the image and get a real analysis.
    // Here, we just return a static result regardless of the image.
    if (!imageUri) {
        throw new Error("No image provided.");
    }
  
    return {
      diseaseName: 'Cercospora Leaf Spot',
      severity: 'Moderate',
      confidence: '88%',
      treatment: [
        'Remove and destroy infected leaves to reduce fungal spread.',
        'Apply a copper-based or sulfur-based fungicide.',
        'Ensure proper air circulation around plants by spacing them correctly.',
        'Avoid overhead watering to keep foliage dry.',
      ],
      detectedImage: diseaseImage,
    };
  };
  
  /**
   * Mock API for the chatbot.
   * @param {string} message - The user's message.
   * @returns {Promise<string>} - A promise that resolves with the bot's reply.
   */
  export const getChatbotResponse = async (message) => {
      await networkDelay(1000); // Simulate 1 second response time
      const lowerCaseMessage = message.toLowerCase();
  
      if (lowerCaseMessage.includes('fertilizer') && lowerCaseMessage.includes('wheat')) {
          return "For wheat, a nitrogen-rich fertilizer like urea is recommended during the tillering stage. A soil test can give you a more precise recommendation.";
      } else if (lowerCaseMessage.includes('water') || lowerCaseMessage.includes('irrigation')) {
          return "Irrigation needs depend on your crop, soil type, and weather. For corn, deep watering once a week is generally better than shallow watering every day.";
      } else if (lowerCaseMessage.includes('pest')) {
          return "Common pests include aphids and mites. Neem oil is a good organic option for controlling them. Can you describe the pest you are seeing?";
      } else if (lowerCaseMessage.includes('hello') || lowerCaseMessage.includes('hi')) {
          return "Hello! I am your Smart Farmer Assistant. How can I help you today?";
      } else {
          return "I'm sorry, I'm not sure how to answer that yet. Try asking me about fertilizers, pests, or irrigation for a specific crop.";
      }
  };