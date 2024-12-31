const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const { v4: uuidv4 } = require('uuid');// For generating fake transaction IDs

// Create a new booking
router.post('/book', async (req, res) => {
    const { busId, commuterId, price } = req.body;

    if (!busId || !commuterId || !price) {
        return res.status(400).json({ message: 'Missing required booking details' });
    }

    try {
        // Generate a unique ticket number
        const ticketNumber = uuidv4();

        // Create a new ticket
        const ticket = new Ticket({
            ticketNumber,
            busId,
            commuterId,
            price,
        });

        const savedTicket = await ticket.save();
        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            ticket: savedTicket,
        });
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Update payment for a ticket
router.post('/payment/:ticketId', async (req, res) => {
    const { ticketId } = req.params;
    const { paymentMethod } = req.body;

    try {
        const ticket = await Ticket.findById(ticketId);
        if (!ticket) {
            return res.status(404).json({ success: false, message: 'Ticket not found' });
        }

        // Simulate a payment transaction
        const transactionId = uuidv4();
        ticket.paymentDetails = {
            transactionId,
            date: new Date(),
            status: 'Paid',
        };

        const updatedTicket = await ticket.save();
        res.status(200).json({
            success: true,
            message: 'Payment successful (simulation)',
            ticket: updatedTicket,
        });
    } catch (error) {
        console.error('Error processing payment:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

module.exports = router;
