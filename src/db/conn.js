require('dotenv').config(); // Load environment variables from .env file
const mongoose = require('mongoose');

// Asynchronously connect to MongoDB
const connectMongoDB = async () => {
    try {
        // Use the mongoose library to connect to the MongoDB database
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.log('Error connecting to MongoDB:', error.message);
    }
};

connectMongoDB();