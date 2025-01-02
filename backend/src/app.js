const express = require('express');
const mongoose = require('mongoose'); 
const cors = require('cors'); 
const { swaggerUi, swaggerSpec } = require('./config/swagger'); 
require('dotenv').config();


const app = express();

// Middleware
app.use(express.json()); 
app.use(cors()); 

// Swagger API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Socket.IO setup for real-time seat reservation
const http = require('http').Server(app);
const io = require('socket.io')(http);

// Socket.IO event listener
io.on('connection', (socket) => {
    console.log('A user connected');
    
    socket.on('reserve-seat', (data) => {
        console.log('Seat reserved:', data);
        io.emit('seat-update', data); // Broadcast seat update to all users
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Example: Verify server works
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Import routes and register them
const routes = {
    auth: require('./routes/authRoutes'),
    buses: require('./routes/busRoutes'),
    routes: require('./routes/routeRoutes'),
    dashboard: require('./routes/dashboardRoutes'),
    payment: require('./routes/paymentRoutes'),
    bookings: require('./routes/bookingRoutes')
};

Object.entries(routes).forEach(([path, route]) => app.use(`/${path}`, route));

// MongoDB connection using URI from .env
const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
    console.error('Error: MONGO_URI is not defined in .env file.');
    process.exit(1); // Exit if MongoDB URI is not configured
}

mongoose
    .connect(mongoURI)
    .then(() => console.log('MongoDB Atlas connected successfully!'))
    .catch((err) => {
        console.error('MongoDB connection failed:', err.message);
        process.exit(1);
    });

// Start the server with Socket.IO integration
const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
