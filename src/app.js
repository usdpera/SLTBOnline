const express = require('express');
const mongoose = require('mongoose'); // For database connection
const cors = require('cors'); // For handling CORS issues
const { swaggerUi, swaggerSpec } = require('./config/swagger'); // Swagger configuration
require('dotenv').config(); // To use environment variables

const app = express();

// Debugging log
//console.log("Initializing app...");

// Middleware
app.use(express.json()); // Parse incoming JSON requests
app.use(cors()); // Enable CORS

// Swagger API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Verify MONGO_URI
const mongoURI = process.env.MONGO_URI || '';
if (!mongoURI) {
    console.error("Error: MONGO_URI is not defined in .env file.");
    process.exit(1);
}

//################
// Import Routes
const authRoutes = require('./routes/authRoutes');
const busRoutes = require('./routes/busRoutes');
const routeRoutes = require('./routes/routeRoutes');

// Routes
console.log("Connecting auth routes...");//debugging logs
app.use('/auth', authRoutes);
console.log("Connecting bus routes...");
app.use('/buses', busRoutes);
console.log("Connecting route routes...");
app.use('/routes', routeRoutes);

// Database Connection
//const mongoURI = process.env.MONGO_URI || '';
mongoose
    .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected...'))
    .catch((err) => {
        console.error('MongoDB connection failed:', err.message);
        process.exit(1);
    });

// Default Route
app.get('/', (req, res) => {
    res.send('Welcome to the National Transport Commission API!');
});

// Start Server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

/*// Debugging log
//console.log("Initializing app...");
console.log("Connecting auth routes...");
app.use('/auth', require('./routes/authRoutes'));

console.log("Connecting bus routes...");
app.use('/buses', require('./routes/busRoutes'));

console.log("Connecting route routes...");
app.use('/routes', require('./routes/routeRoutes'));

// Database Connection
const mongoURI = process.env.MONGO_URI || '';
if (!mongoURI) {
    console.error("Error: MONGO_URI is not defined in .env");
    process.exit(1);
}
mongoose
    .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB connected...');
    })
    .catch((err) => {
        console.error('MongoDB connection failed:', err.message);
        process.exit(1);
    });

// Routes (Add your API routes here)
app.use('/auth', require('./routes/authRoutes')); // Authentication routes
app.use('/buses', require('./routes/busRoutes')); // Bus-related routes
app.use('/routes', require('./routes/routeRoutes')); // Route-related APIs

// Default Route for Testing
app.get('/', (req, res) => {
    res.send('Welcome to the National Transport Commission API!');
});

// Start the Server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});*/
