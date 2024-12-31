const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/roleMiddleware');

/**
 * @swagger
 * /dashboard:
 *   get:
 *     summary: Retrieve dashboard statistics
 *     description: Fetch total users, buses, routes, tickets sold, and user roles (admin, operator, commuter).
 *     tags:
 *       - Dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalUsers:
 *                   type: integer
 *                   description: Total number of users.
 *                 totalBuses:
 *                   type: integer
 *                   description: Total number of buses.
 *                 totalRoutes:
 *                   type: integer
 *                   description: Total number of routes.
 *                 ticketsSold:
 *                   type: integer
 *                   description: Total tickets sold.
 *                 totalOperators:
 *                   type: integer
 *                   description: Total number of operators.
 *                 totalCommuters:
 *                   type: integer
 *                   description: Total number of commuters.
 *                 totalAdmins:
 *                   type: integer
 *                   description: Total number of admins.
 *       401:
 *         description: Unauthorized, missing or invalid token.
 *       403:
 *         description: Forbidden, insufficient permissions.
 */

const User = require('../models/User');
const Bus = require('../models/Bus');
const Route = require('../models/Route');
const Ticket = require('../models/Ticket');

router.get('/', authenticateUser, authorizeRoles('admin', 'operator', 'commuter'), async (req, res) => {
  console.log('Dashboard route reached');
  
  try {
    // Fetch statistics from database
    const totalUsers = await User.countDocuments();
    const totalBuses = await Bus.countDocuments();
    const totalRoutes = await Route.countDocuments();
    const ticketsSold = await Ticket.countDocuments();

    // Count users by roles
    const totalOperators = await User.countDocuments({ role: 'operator' });
    const totalCommuters = await User.countDocuments({ role: 'commuter' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });

    // Construct the response with role-specific counts
    const dashboardData = {
      totalUsers,
      totalBuses,
      totalRoutes,
      ticketsSold,
      totalOperators,
      totalCommuters,
      totalAdmins,
    };

    res.status(200).json(dashboardData);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
