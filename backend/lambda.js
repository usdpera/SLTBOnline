const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { swaggerUi, swaggerSpec } = require('./src/config/swagger');
require('dotenv').config();
const swaggerJsDoc = require('swagger-jsdoc');
const serverless = require('serverless-http');

const app = express();

// Middleware
app.use(express.json()); // Parse incoming JSON requests
app.use(cors()); // Enable CORS

// Swagger API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('./src/config/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerDocs);
});
// Health check route (useful for Lambda)
app.get('/', (req, res) => {
    res.send('API is running...');
});
//
// Dynamically import and register routes (same as new app.js)
const routes = {
    auth: require('./src/routes/authRoutes'),
    buses: require('./src/routes/busRoutes'),
    routes: require('./src/routes/routeRoutes'),
    dashboard: require('./src/routes/dashboardRoutes'),
    payment: require('./src/routes/paymentRoutes'),
    bookings: require('./src/routes/bookingRoutes')
};

// Dynamically register routes
Object.entries(routes).forEach(([path, route]) => app.use(`/${path}`, route));

// MongoDB connection using the environment variable
const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
    console.error("Error: MONGO_URI is not defined in .env file.");
    process.exit(1); // Exit if MongoDB URI is not configured
}

mongoose
    .connect(mongoURI)
    .then(() => console.log('MongoDB Atlas connected successfully!'))
    .catch((err) => {
        console.error('MongoDB connection failed:', err.message);
        process.exit(1);
    });

// Placeholder for real-time seat reservation (Socket.IO events are not supported directly in Lambda)
app.post('/socket-events', (req, res) => {
    const { event, data } = req.body;
    console.log(`Received event: ${event} with data:`, data);

    // Event handling logic (e.g., for seat reservations)
    if (event === 'reserve-seat') {
        console.log('Seat reserved:', data);
    }

    res.status(200).send({ message: 'Event processed successfully' });
});

// Lambda handler using serverless-http
module.exports.handler = serverless(app, {
    request: (request, event, context) => {
        try {
            if (event.body) {
                request.body = JSON.parse(event.body);
            }
        } catch (error) {
            console.error('Error parsing body:', error);
            request.body = {}; // Fallback to an empty object
        }
    },
});
