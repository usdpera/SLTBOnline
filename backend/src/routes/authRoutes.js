const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // Library for password hashing and comparison
const router = express.Router();
const User = require('../models/user'); // Import the User model
const { authenticateUser } = require('../middlewares/authMiddleware'); // Authentication middleware
const { authorizeRoles } = require('../middlewares/roleMiddleware'); // Role-based authorization middleware

// =====================
// REGISTER - User Registration Endpoint
// =====================

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account with a name, email, password, and role.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Full name of the user.
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 description: Email address of the user.
 *                 example: "john.doe@example.com"
 *               password:
 *                 type: string
 *                 description: Password for the account.
 *                 example: "strongpassword123"
 *               role:
 *                 type: string
 *                 description: Role of the user (e.g., admin, user).
 *                 example: "user"
 *     responses:
 *       201:
 *         description: User registered successfully.
 *       400:
 *         description: Missing required fields or user already exists.
 *       500:
 *         description: Server error.
 */

router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // 1. Validate input fields - Ensure no empty values
        if (!name || !email || !password || !role) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        // 2. Check if a user with the given email already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ error: 'User already exists.' });
        }

        // 3. Create a new user instance
        const user = new User({
            name,
            email,
            password, // The password will be hashed in the User model pre-save hook
            role,
        });

        // 4. Save the new user to the database
        await user.save();

        // 5. Send success response
        res.status(201).json({ message: 'User registered successfully.' });
    } catch (err) {
        // Catch and send any unexpected errors
        res.status(500).json({ error: err.message });
    }
});

// =====================
// LOGIN - User Login Endpoint
// =====================

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     description: Authenticates a user and provides a JWT token upon successful login.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email address of the user.
 *                 example: "john.doe@example.com"
 *               password:
 *                 type: string
 *                 description: User's password.
 *                 example: "mypassword123"
 *     responses:
 *       200:
 *         description: Login successful, JWT token returned.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Login successful."
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication.
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Invalid credentials or missing fields.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid credentials."
 *       500:
 *         description: Server error.
 */

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Validate input fields
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required.' });
        }

        console.log("Login attempt for:", email); // Log email

        // 2. Check if the user exists in the database
        const user = await User.findOne({ email });
        if (!user) {
            console.log("User not found in DB");
            return res.status(400).json({ error: 'Invalid credentials.' });
        }

        console.log("Stored hashed password:", user.password); // Log the hashed password

        // 3. Compare the provided password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);
        console.log("Password entered:", password); // Plain text password
        console.log("Password match result:", isMatch); // Debugging line

        if (!isMatch) {
            console.log("Password comparison failed.");
            return res.status(400).json({ error: 'Invalid credentials.' });
        }

        // 4. Generate a JWT token for authentication
        const token = jwt.sign(
            { id: user._id, role: user.role }, // Token payload
            process.env.JWT_SECRET,           // Secret key for token signing
            { expiresIn: '1h' }               // Token expiration time
        );

        // 5. Send success response with token
        res.status(200).json({ message: 'Login successful.', token });
    } catch (err) {
        // Catch and send any unexpected errors
        res.status(500).json({ error: err.message });
    }
});

// =====================
// DELETE USER - Delete a Single User by Email or ID
// =====================

/**
 * @swagger
 * /auth/delete:
 *   delete:
 *     summary: Delete a user
 *     description: Deletes a single user from the database using email or ID.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email address of the user to delete.
 *                 example: "john.doe@example.com"
 *               id:
 *                 type: string
 *                 description: Unique ID of the user to delete.
 *                 example: "64a1f51e1234567890abcdef"
 *     responses:
 *       200:
 *         description: User deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User deleted successfully."
 *                 deletedUser:
 *                   type: object
 *                   description: Details of the deleted user.
 *       400:
 *         description: Missing email or ID, or both provided.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Please provide an email or user ID."
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found."
 *       500:
 *         description: Server error.
 */

router.delete('/delete', async (req, res) => {
    try {
        const { email, id } = req.body;

        // 1. Validate input: Require either email or ID
        if (!email && !id) {
            return res.status(400).json({ error: 'Please provide an email or user ID.' });
        }

        let deletedUser;

        // 2. Find and delete the user based on email or ID
        if (email) {
            deletedUser = await User.findOneAndDelete({ email });
        } else if (id) {
            deletedUser = await User.findByIdAndDelete(id);
        }

        // 3. If no user is found, send a 404 response
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // 4. Send success response with deleted user details
        res.status(200).json({
            message: 'User deleted successfully.',
            deletedUser,
        });
    } catch (err) {
        // Catch and send any unexpected errors
        res.status(500).json({ error: err.message });
    }
});

// =====================
// DELETE ALL USERS - Delete All Users in the Database
// =====================

/**
 * @swagger
 * /auth/delete-all:
 *   delete:
 *     summary: Delete all users
 *     description: Deletes all users in the database. Restricted to admin users.
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All users deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "All users deleted successfully."
 *       401:
 *         description: Unauthorized access (no token or invalid token).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Unauthorized."
 *       403:
 *         description: Forbidden (insufficient permissions).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "You do not have permission to perform this action."
 *       500:
 *         description: Server error.
 */

router.delete('/delete-all',authorizeRoles('admin'), async (req, res) => {
    try {
        // 1. Delete all users from the database
        await User.deleteMany({});

        // 2. Send success response
        res.status(200).json({ message: 'All users deleted successfully.' });
    } catch (err) {
        // Catch and send any unexpected errors
        res.status(500).json({ error: err.message });
    }
});

// Export the router to use in the main app
module.exports = router;
