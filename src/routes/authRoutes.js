const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // Library for password hashing and comparison
const router = express.Router();
const User = require('../models/user'); // Import the User model

// =====================
// REGISTER - User Registration Endpoint
// =====================
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
router.delete('/delete-all', async (req, res) => {
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
