const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  commuterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  seatNumber: { type: Number, required: true },
  routeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Route', required: true },
  status: { type: String, enum: ['reserved', 'completed'], default: 'reserved' },
});

module.exports = mongoose.model('Booking', bookingSchema);