const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid'); // For generating fake transaction IDs

// Mock Payment Endpoint
router.post('/simulate', (req, res) => {
    const { amount, currency, paymentMethod } = req.body;

    // Simulate basic validation
    if (!amount || !currency || !paymentMethod) {
        return res.status(400).json({
            success: false,
            message: 'Missing required payment details (amount, currency, paymentMethod)',
        });
    }

    // Simulate processing delay (optional)
    setTimeout(() => {
        // Generate a fake transaction ID
        const transactionId = uuidv4();

        // Respond with a simulated success response
        res.status(200).json({
            success: true,
            message: 'Payment processed successfully (simulation)',
            transactionId,
            amount,
            currency,
            paymentMethod,
        });
    }, 1000); // 1-second delay for simulation
});

module.exports = router;
