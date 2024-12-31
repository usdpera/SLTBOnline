const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema(
    {
        ticketNumber: { type: String, required: true, unique: true },
        busId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus', required: true },
        commuterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Reference to Commuter (User)
        dateOfIssue: { type: Date, default: Date.now },
        price: { type: Number, required: true },
        paymentDetails: {
            transactionId: { type: String, required: false }, // Transaction ID from simulation
            date: { type: Date, required: false }, // Payment date
            status: { type: String, default: 'Pending' }, // Payment status (Pending, Paid, Failed)
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Ticket', TicketSchema);
