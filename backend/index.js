require('dotenv').config();
const express = require('express');
const z = require('zod');
const { default: mongoose } = require('mongoose');
const { User, Data } = require('./db');
const app = express();
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'uploads/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: function (req, file, cb) {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

app.post('/api/v1/signup', async (req, res) => {
    console.log("hell")
    const { username, email, password } = req.body;

    // define zod schema for validation
    const signupzod = z.object({
        username: z.string(),
        email: z.string(),
        password: z.string().min(6).max(12),
    })
    const validate = signupzod.safeParse(req.body);
    if (!validate.success) {
        return res.status(400).json({ error: validate.error });
    }

    // creating user in db.
    try {
        // here we use bcrypt for hashing password
        const hashpassword = await bcrypt.hash(password, 5)
        await User.create({ username, email, password: hashpassword })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: "Internal server error" })
    }
    res.json({
        massage: 'User created succesfully',
    });
});

app.post('/api/v1/signin', async (req, res) => {
    const { email, password } = req.body

    // creaing zod schema for validation
    const signinzod = z.object({
        email: z.string(),
        password: z.string().min(6).max(12),
    })
    const validate = signinzod.safeParse(req.body);
    if (!validate.success) {
        return res.status(400).json({ error: validate.error })
    }

    // checking that user exist in db or not 
    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ error: "Invalid username or password" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: "Invalid username or password" });
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET)
        res.json({
            massage: "User signin successfully",
            token
        });
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: "Internal server error" });
    }
})

app.post("/api/v1/diseasePredict", upload.single('image'), async (req, res) => {
    try {
        // Check if file was uploaded
        if (!req.file) {
            return res.status(400).json({
                error: "No image file provided. Please upload an image file."
            });
        }

        // Validate file type
        if (!req.file.mimetype.startsWith('image/')) {
            // Clean up uploaded file
            fs.unlinkSync(req.file.path);
            return res.status(400).json({
                error: "Invalid file type. Only image files are allowed."
            });
        }

        // ML service URL (assuming it's running on port 5000)
        const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5000';

        // Create form data to send to ML service
        const formData = new FormData();
        formData.append('file', fs.createReadStream(req.file.path), {
            filename: req.file.originalname,
            contentType: req.file.mimetype
        });

        // Send request to ML service
        const response = await axios.post(`${ML_SERVICE_URL}/predict_disease`, formData, {
            headers: {
                ...formData.getHeaders()
            },
            timeout: 30000 // 30 second timeout
        });

        // Clean up uploaded file
        fs.unlinkSync(req.file.path);

        // Return prediction result
        res.json({
            success: true,
            message: "Disease prediction completed successfully",
            prediction: response.data
        });

    } catch (error) {
        // Clean up uploaded file if it exists
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        console.error('Disease prediction error:', error.message);

        if (error.code === 'ECONNREFUSED') {
            return res.status(503).json({
                error: "ML service is not available. Please try again later."
            });
        }

        if (error.response) {
            return res.status(error.response.status).json({
                error: error.response.data.error || "ML service error"
            });
        }

        res.status(500).json({
            error: "Internal server error during disease prediction"
        });
    }
});

app.get("/api/reverse-geocode", async (req, res) => {
    try {
        const { lat, lon } = req.query;
        console.log("Incoming query:", req.query);
    
        const response = await axios.get("https://us1.locationiq.com/v1/reverse", {
          params: {
            key: "pk.bfd5fddfb2ac4ce5d7b2134950a5f453", // <-- your API key
            lat,
            lon,
            format: "json"
          },
          headers: {
            "User-Agent": "my-app/1.0 (myemail@example.com)" // required by LocationIQ
          }
        });
    console.log(response.data)
        // If you only care about district, extract it:
        const district = response.data?.address?.state_district || response.data?.address?.county || null;
    
        res.json({
          raw: response.data,
          district
        });
      } catch (error) {
        console.error("Error in reverse geocoding:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to reverse geocode" });
      }
});

app.get("/api/v1/crop_prediction", async (req, res) => {
    try {
        let dist = req.query.dist;
        dist = dist.trim();
        // const districtData = await Data.findOne({
        //     district: { $regex: new RegExp(`^${dist}$`, 'i') }
        // });
        // console.log("THE ACTUAL KEYS ARE:", Object.keys(districtData));

        // if (!districtData) {
        //     return res.status(404).json({ error: `No data found for district: ${dist}` });
        // }
        const mongooseDoc = await Data.findOne({
            District_Name: { $regex: new RegExp(`^${dist}$`, 'i') }
        });

        if (!mongooseDoc) {
            return res.status(404).json({ error: `No data found for district: ${dist}` });
        }
        const districtData = mongooseDoc.toObject();
        console.log("Plain data object:", districtData);
        console.log("Kharif Defaults:", districtData.Kharif_Defaults);

        const weatherResponse = await axios.get(
            `http://api.weatherapi.com/v1/current.json?key=3ad23bda0dec40069df193439251409&q=${dist}`
        );
        const humidity = weatherResponse.data?.current?.humidity;
        const temperature = weatherResponse.data?.current?.temp_c;
        const rainfall = weatherResponse.data?.current?.precip_mm;
        if (humidity === undefined || temperature === undefined || rainfall === undefined) {
            return res.status(500).json({ error: "Incomplete weather data received" });
        }

        const response = await axios.post("http://localhost:5000/predict_crop", {
            N: districtData.N_Value,
            P: districtData.P_Value,
            K: districtData.K_Value,
            ph: districtData.pH_Value,
            temperature,
            humidity,
            rainfall
        })

        const modelPrediction = response.data.recommended_crop;
        console.log("Model's Raw Prediction:", modelPrediction);
        let finalRecommendation = modelPrediction;

        const currentDate = new Date();
        const currentMonth = currentDate.getMonth(); // 0 = January, 1 = February, etc.

        const rabiCrops = ['Wheat', 'Mustard', 'Garlic', 'ChickPea', 'Lentil', 'Peas', 'Barley'];
        const kharifCrops = ['Rice', 'Maize', 'Sugarcane', 'Cotton', 'PigeonPeas', 'Jute', 'MothBeans'];

        if (currentMonth >= 5 && currentMonth <= 9) {
            if (!kharifCrops.includes(modelPrediction)) {
                finalRecommendation = `${districtData.Kharif_Defaults}`;
            }
        } else {
            if (!rabiCrops.includes(modelPrediction)) {
                finalRecommendation = `${districtData.Rabi_Defaults}`;
            }
        }
        return res.json({
            crop: finalRecommendation
        });
    } catch (error) {
        console.error("Error fetching data:", error.message);
        res.status(500).json({ error: "Server error while fetching crop prediction data" });
    }
});

app.post('/chat', async (req, res) => {
    const { query } = req.body; 
    if (!query) {
        return res.status(400).json({ error: "Query is required" });
    }
    try {
      const response = await axios.post('http://localhost:5000/chat', { query });
      res.json({ answer: response.data.answer });
    } catch (error) {   
        console.error('Error communicating with chatbot service:', error.message);
        res.status(500).json({ error: "Failed to get response from chatbot service" });
    }
});

async function main() {
    if (process.env.MONGODB_URL === undefined) {
        throw new Error("MONGODB_URL is not defined");
    }
    console.log("hello")
    await mongoose.connect(process.env.MONGODB_URL).then(() => {
        console.log("connect")
    });
    app.listen(PORT, () => {
        console.log("Server is running on port 3000");
    });
}
main()
