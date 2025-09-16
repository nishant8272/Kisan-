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
        // Check if file is an image
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


/**
 * Disease Prediction Endpoint
 * 
 * POST /api/v1/diseasePredict
 * 
 * Description: Predicts plant disease from uploaded image
 * 
 * Request:
 * - Method: POST
 * - Content-Type: multipart/form-data
 * - Body: Form data with 'image' field containing image file
 * 
 * Response:
 * - Success (200): { success: true, message: string, prediction: { predicted_class: string, confidence: number } }
 * - Error (400): { error: string } - No file or invalid file type
 * - Error (503): { error: string } - ML service unavailable
 * - Error (500): { error: string } - Internal server error
 * 
 * Requirements:
 * - Image file must be uploaded as 'image' field
 * - Supported formats: jpg, jpeg, png, gif, etc.
 * - Max file size: 10MB
 * - ML service must be running on ML_SERVICE_URL (default: http://localhost:5000)
 */
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
        console.log(req.query)
        const response = await axios.get("https://nominatim.openstreetmap.org/reverse", {
            params: { lat, lon, format: "json" },
            headers: { "User-Agent": "my-app/1.0 (myemail@example.com)" }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get("/api/v1/crop_prediction", async (req, res) => {
    try {
        let dist = req.query.dist;
        dist = dist.trim();
        const districtData = await Data.findOne({
            district: { $regex: new RegExp(`^${dist}$`, 'i') }
        });
        if (!districtData) {
            return res.status(404).json({ error: `No data found for district: ${dist}` });
        }

        const weatherResponse = await axios.get(
            "http://api.weatherapi.com/v1/current.json?key=3ad23bda0dec40069df193439251409&q=Meerut"
        );
        const humidity = weatherResponse.data?.current?.humidity;
        const temperature = weatherResponse.data?.current?.temp_c;
        const rainfall = weatherResponse.data?.current?.precip_mm;
        if (humidity === undefined || temperature === undefined || rainfall === undefined) {
            return res.status(500).json({ error: "Incomplete weather data received" });
        }

        const response = axios.post("http://localhost:5000/predict_crop", {
            N: districtData.N,
            P: districtData.P,
            K: districtData.K,
            ph: districtData.ph,
            temperature,
            humidity,
            rainfall
        })
        response.then(data => {
            console.log("Crop Prediction:", data.data);
        })
        return res.json({
            crop: response.data.recommended_crop
        })
        // dist value from data base like all value n, p, k, ph and send these value to model
        // humidity or temprature or rainfall as precip_mm from api http://api.weatherapi.com/v1/current.json?key=3ad23bda0dec40069df193439251409&q=Meerut
        // and send these value to model
        // model resonse back with crop name
    } catch (error) {
        console.error("Error fetching data:", error.message);
        res.status(500).json({ error: "Server error while fetching crop prediction data" });
    }
});



async function main() {
    if (process.env.MONGODB_URL === undefined) {
        throw new Error("MONGODB_URL is not defined");
    }
    await mongoose.connect(process.env.MONGODB_URL).then(() => {
        console.log
    });
    app.listen(PORT, () => {
        console.log("Server is running on port 3000");
    });
}
main()
