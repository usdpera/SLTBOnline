// routes/routeRoutes.js
const express = require('express');
const router = express.Router();
const Route = require('../models/Route'); // Import Route model
const { authenticateUser } = require('../middlewares/authMiddleware'); // Import middleware for authentication

// CREATE - Add a new route
router.post('/add', authenticateUser, async (req, res) => {
    const { Origin, Destination, Distance, Name, RouteID } = req.body;

    // Validate required fields
    if (!Origin || !Destination || !Distance || !Name || !RouteID) {
        return res.status(400).json({ error: 'All fields (Origin, Destination, Distance, Name, RouteID) are required.' });
    }

    try {
        const newRoute = new Route({ Origin, Destination, Distance, Name, RouteID });
        const savedRoute = await newRoute.save();
        res.status(201).json(savedRoute);
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ error: 'RouteID must be unique.' });
        }
        res.status(500).json({ error: err.message });
    }
});

// READ - Get all routes
router.get('/', async (req, res) => {
    try {
        const routes = await Route.find();
        res.json(routes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// READ - Get a single route by ID
router.get('/:id', async (req, res) => {
    try {
        const route = await Route.findById(req.params.id);
        if (!route) return res.status(404).json({ error: 'Route not found' });
        res.json(route);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE - Update a route by ID
router.put('/:id', authenticateUser, async (req, res) => {
    const { Origin, Destination, Distance, Name, RouteID } = req.body;

    if (!Origin || !Destination || !Distance || !Name || !RouteID) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        const updatedRoute = await Route.findByIdAndUpdate(
            req.params.id,
            { Origin, Destination, Distance, Name, RouteID },
            { new: true, runValidators: true }
        );
        if (!updatedRoute) return res.status(404).json({ error: 'Route not found' });
        res.json(updatedRoute);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE - Remove a route by ID
router.delete('/:id', authenticateUser, async (req, res) => {
    try {
        const deletedRoute = await Route.findByIdAndDelete(req.params.id);
        if (!deletedRoute) return res.status(404).json({ error: 'Route not found' });
        res.json({ message: 'Route deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
