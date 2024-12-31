const express = require('express');
const mongoose = require('mongoose'); 
const cors = require('cors'); 
const { swaggerUi, swaggerSpec } = require('./config/swagger'); 
require('dotenv').config(); 

const app = express();

// Socket.IO setup
const http = require('http').Server(app);
const io = require('socket.io')(http);

// Swagger API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Middleware
app.use(express.json()); 
app.use(cors()); 

//Mock payment
const paymentRoutes = require('./routes/paymentRoutes');
app.use('/payment', paymentRoutes);

// Booking routes
const bookingRoutes = require('./routes/bookingRoutes');
app.use('/bookings', bookingRoutes);

// Socket.IO event listener (real-time seat reservation)
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('reserve-seat', (data) => {
        console.log('Seat reserved:', data);
        // You can now broadcast the seat reservation status to other users
        io.emit('seat-update', data); // Broadcast the seat availability
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Example: Verify server works
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Routes
const authRoutes = require('./routes/authRoutes');
const busRoutes = require('./routes/busRoutes');
const routeRoutes = require('./routes/routeRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

app.use('/auth', authRoutes);
app.use('/buses', busRoutes);
app.use('/routes', routeRoutes);
app.use('/dashboard', dashboardRoutes);

// // Database Connection
// mongoose
//     .connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ntc_api', { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => console.log('MongoDB connected...'))
//     .catch((err) => {
//         console.error('MongoDB connection failed:', err.message);
//         process.exit(1);
//     });

// Database Connection to MongoDB Atlas
const uri = process.env.MONGO_URI || 'mongodb+srv://ushandperera:<db_password>@sltbonlinemongodbcluste.ztevt.mongodb.net/?retryWrites=true&w=majority&appName=SLTBOnlineMongoDBCluster';

mongoose
    .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Atlas connected successfully!'))
    .catch((err) => {
        console.error('MongoDB connection failed:', err.message);
        process.exit(1);
    });

// Start the server with Socket.IO integration
http.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on port ${process.env.PORT || 3000}`);
});

module.exports = app; 
