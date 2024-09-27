// /server/index.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const billRoutes = require('./routes/billRoutes');

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json()); // Parse JSON bodies
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI , {
    serverSelectionTimeoutMS: 50000, // Increase the timeout to 50 seconds
  })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Placeholder route
app.get('/', (req, res) => res.send('Utility Bill Payment API'));

// Server listening
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Import routes 
app.use('/api/bills', billRoutes);