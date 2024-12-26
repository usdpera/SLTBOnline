const express = require('express');
const router = express.Router();
const Bus = require('../models/bus'); // Bus model
const User = require('../models/user'); // User model for Operator validation
const Route = require('../models/Route'); // Route model for RouteID validation
const { authenticateUser } = require('../middlewares/authMiddleware'); // Authentication middleware
const { authorizeRoles } = require('../middlewares/roleMiddleware'); // Role-based authorization middleware

// CREATE - Add a new bus (Protected: Admin, Operator)
router.post('/add', authenticateUser, authorizeRoles('admin', 'operator'), async (req, res) => {
    const { BusNumber, Capacity, Type, RouteID, OperatorID } = req.body;

    // Validate required fields
    if (!BusNumber || !Capacity || !Type || !RouteID || !OperatorID) {
        return res.status(400).json({ error: 'All fields (BusNumber, Capacity, Type, RouteID, Operator) are required.' });
    }

    try {
        // Validate RouteID
        const route = await Route.findById(RouteID);
        if (!route) {
            return res.status(400).json({ error: 'Invalid RouteID. Route does not exist.' });
        }

        // Validate Operator
        const operator = await User.findOne({ _id: OperatorID, role: 'operator' });
        if (!operator) {
            return res.status(400).json({ error: 'Invalid Operator. User does not exist or is not an operator.' });
        }

        // Create and save the new bus
        const newBus = new Bus({ BusNumber, Capacity, Type, RouteID, OperatorID });
        const savedBus = await newBus.save();
        res.status(201).json(savedBus);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// READ - Get all buses (Public)
router.get('/', async (req, res) => {
    try {
        const buses = await Bus.find()
            .populate('Operator', 'name email role') // Populate Operator details
            .populate('RouteID', 'Name Origin Destination Distance'); // Populate Route details
        res.json(buses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// READ - Get a single bus by ID (Public)
router.get('/:id', async (req, res) => {
    try {
        const bus = await Bus.findById(req.params.id)
            .populate('Operator', 'name email role') // Populate Operator details
            .populate('RouteID', 'Name Origin Destination Distance'); // Populate Route details
        if (!bus) return res.status(404).json({ error: 'Bus not found' });
        res.json(bus);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE - Update a bus by ID (Protected: Admin, Operator)
router.put('/:id', authenticateUser, authorizeRoles('admin', 'operator'), async (req, res) => {
    const { BusNumber, Capacity, Type, RouteID, OperatorID } = req.body;

    // Validate required fields
    if (!BusNumber || !Capacity || !Type || !RouteID || !OperatorID) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        // Validate RouteID
        const route = await Route.findById(RouteID);
        if (!route) {
            return res.status(400).json({ error: 'Invalid RouteID. Route does not exist.' });
        }

        // Validate Operator
        const operator = await User.findOne({ _id: OperatorID, role: 'operator' });
        if (!OperatorID) {
            return res.status(400).json({ error: 'Invalid Operator. User does not exist or is not an operator.' });
        }

        // Update and save the bus
        const updatedBus = await Bus.findByIdAndUpdate(
            req.params.id,
            { BusNumber, Capacity, Type, RouteID, OperatorID },
            { new: true, runValidators: true }
        );
        if (!updatedBus) return res.status(404).json({ error: 'Bus not found' });
        res.json(updatedBus);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE - Remove a bus by ID (Protected: Admin only)
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
