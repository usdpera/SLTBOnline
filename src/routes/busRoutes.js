//DEBUGGING
console.log('__dirname:', __dirname);
console.log('Middleware path:', require.resolve('../middlewares/authMiddleware'));

const express = require('express');
const router = express.Router();
const Bus = require('../models/bus'); // Bus model
const { authenticateUser } = require('../middlewares/authMiddleware'); // Import middleware
const { authorizeRoles } = require('../middlewares/roleMiddleware'); // Import middleware

// CREATE - Add a new bus (Protected)
router.post('/', authenticateUser, authorizeRoles('admin', 'operator'),(async (req, res) => {
    try {
        const newBus = new Bus(req.body);
        const savedBus = await newBus.save();
        res.status(201).json(savedBus);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}));

// READ - Get all buses (Public)
router.get('/', authenticateUser, async (req, res) => {
    try {
        const buses = await Bus.find();
        res.json(buses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// READ - Get a single bus by ID (Public)
router.get('/:id', authenticateUser, async (req, res) => {
    try {
        const bus = await Bus.findById(req.params.id);
        if (!bus) return res.status(404).json({ error: 'Bus not found' });
        res.json(bus);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE - Update a bus by ID (Protected)
router.put('/:id', authenticateUser, authorizeRoles('admin','operator'), async (req, res) => {
    try {
        const updatedBus = await Bus.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedBus) return res.status(404).json({ error: 'Bus not found' });
        res.json(updatedBus);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE - Remove a bus by ID (Protected)
router.delete('/:id', authenticateUser, authorizeRoles('admin'), async (req, res) => {
    try {
        const deletedBus = await Bus.findByIdAndDelete(req.params.id);
        if (!deletedBus) return res.status(404).json({ error: 'Bus not found' });
        res.json({ message: 'Bus deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
