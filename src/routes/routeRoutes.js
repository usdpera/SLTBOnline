const express = require('express');
const router = express.Router();
const Route = require('../models/Route'); // Route model
const { authenticateUser } = require('../middlewares/authMiddleware'); // Import middleware

// CREATE - Add a new route (Protected)
router.post('/', authenticateUser, async (req, res) => {
    try {
        const newRoute = new Route(req.body);
        const savedRoute = await newRoute.save();
        res.status(201).json(savedRoute);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// READ - Get all routes (Public)
router.get('/', async (req, res) => {
    try {
        const routes = await Route.find();
        res.json(routes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// READ - Get a single route by ID (Public)
router.get('/:id', async (req, res) => {
    try {
        const route = await Route.findById(req.params.id);
        if (!route) return res.status(404).json({ error: 'Route not found' });
        res.json(route);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE - Update a route by ID (Protected)
router.put('/:id', authenticateUser, async (req, res) => {
    try {
        const updatedRoute = await Route.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedRoute) return res.status(404).json({ error: 'Route not found' });
        res.json(updatedRoute);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE - Remove a route by ID (Protected)
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
