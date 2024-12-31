const express = require('express');
const mongoose = require('mongoose'); // For database connection
const cors = require('cors'); // For handling CORS issues
const { swaggerUi, swaggerSpec } = require('./src/config/swagger'); // Swagger configuration
require('dotenv').config(); // To use environment variables (AWS Lambda uses environment variables configured in the Lambda settings)
const serverless = require('serverless-http');


const app = express();

// Swagger API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Example: Verify server works
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Middleware
app.use(express.json()); // Parse incoming JSON requests
app.use(cors()); // Enable CORS

// Verify MONGO_URI
const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ntc_api';
if (!mongoURI) {
    console.error("Error: MONGO_URI is not defined in .env file.");
    process.exit(1); // Exit if MongoDB URI is not configured
}

// Import Routes
const authRoutes = require('./src/routes/authRoutes');
const busRoutes = require('./src/routes/busRoutes');
const routeRoutes = require('./src/routes/routeRoutes');
const dashboardRoutes = require('./src/routes/dashboardRoutes');

// Routes
console.log("Connecting auth routes...");
app.use('/auth', authRoutes);
console.log("Connecting bus routes...");
app.use('/buses', busRoutes);
console.log("Connecting route routes...");
app.use('/routes', routeRoutes);
console.log("Connecting dashboard routes...");
app.use('/dashboard', dashboardRoutes);

// Database Connection
// MongoDB connection will still work on AWS Lambda if configured correctly
mongoose
    .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected...'))
    .catch((err) => {
        console.error('MongoDB connection failed:', err.message);
        process.exit(1);
    });

// Default Route
// app.get('/', (req, res) => { 
//   res.send('Welcome to the National Transport Commission API!'); 
// });
// Keeping this if needed for health checks, but it's already defined earlier

// Server Initialization
// The following block is unnecessary for AWS Lambda as Lambda handles server lifecycle
// const port = process.env.PORT || 3000;
// app.listen(port, () => {
//     console.log(Server is running on port ${port});
// });

module.exports.handler = serverless(app, {
    request: (request, event, context) => {
        if (event.body) {
            request.body = JSON.parse(event.body);
        }
    }
});