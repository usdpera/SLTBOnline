// routes/routeRoutes.js
const express = require('express');
const router = express.Router();
const Route = require('../models/Route'); // Import Route model
const { authenticateUser } = require('../middlewares/authMiddleware'); // Authentication middleware
const { authorizeRoles } = require('../middlewares/roleMiddleware'); // Role-based authorization middleware

/**
 * @swagger
 * tags:
 *   name: Routes
 *   description: Route management API
 */

/**
 * @swagger
 * /routes/add:
 *   post:
 *     summary: Add a new route
 *     description: Adds a new route with Origin, Destination, Distance, Name, and RouteID.
 *     tags:
 *       - Routes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Origin:
 *                 type: string
 *                 description: Starting point of the route.
 *                 example: "City A"
 *               Destination:
 *                 type: string
 *                 description: End point of the route.
 *                 example: "City B"
 *               Distance:
 *                 type: string
 *                 description: Distance of the route.
 *                 example: "150 km"
 *               Name:
 *                 type: string
 *                 description: Name of the route.
 *                 example: "Express Route"
 *               RouteID:
 *                 type: string
 *                 description: Unique identifier for the route.
 *                 example: "R12345"
 *     responses:
 *       201:
 *         description: Route added successfully.
 *       400:
 *         description: Validation error or missing fields.
 *       500:
 *         description: Server error.
 */

// CREATE - Add a new route
router.post('/add', authenticateUser,authorizeRoles('admin'), async (req, res) => {
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

/**
 * @swagger
 * /routes:
 *   get:
 *     summary: Get all routes
 *     description: Retrieve a list of all routes.
 *     tags:
 *       - Routes
 *     responses:
 *       200:
 *         description: A list of routes.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   Origin:
 *                     type: string
 *                   Destination:
 *                     type: string
 *                   Distance:
 *                     type: string
 *                   Name:
 *                     type: string
 *                   RouteID:
 *                     type: string
 */

// READ - Get all routes
router.get('/', async (req, res) => {
    try {
        const routes = await Route.find();
        res.json(routes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /routes/{id}:
 *   get:
 *     summary: Get a single route by ID
 *     description: Retrieve details of a specific route using its ID.
 *     tags:
 *       - Routes
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the route to retrieve.
 *     responses:
 *       200:
 *         description: Route details retrieved successfully.
 *       404:
 *         description: Route not found.
 */

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

/**
 * @swagger
 * /routes/{id}:
 *   put:
 *     summary: Update a route
 *     description: Update the details of an existing route using its ID.
 *     tags:
 *       - Routes
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the route to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Origin:
 *                 type: string
 *               Destination:
 *                 type: string
 *               Distance:
 *                 type: string
 *               Name:
 *                 type: string
 *               RouteID:
 *                 type: string
 *     responses:
 *       200:
 *         description: Route updated successfully.
 *       400:
 *         description: Validation error or missing fields.
 *       404:
 *         description: Route not found.
 */

// UPDATE - Update a route by ID
router.put('/:id', authenticateUser,authorizeRoles('admin'), async (req, res) => {
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

/**
 * @swagger
 * /routes/{id}:
 *   delete:
 *     summary: Delete a route
 *     description: Delete a specific route using its ID.
 *     tags:
 *       - Routes
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the route to delete.
 *     responses:
 *       200:
 *         description: Route deleted successfully.
 *       404:
 *         description: Route not found.
 */

// DELETE - Remove a route by ID
router.delete('/:id', authenticateUser,authorizeRoles('admin'), async (req, res) => {
    try {
        const deletedRoute = await Route.findByIdAndDelete(req.params.id);
        if (!deletedRoute) return res.status(404).json({ error: 'Route not found' });
        res.json({ message: 'Route deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;