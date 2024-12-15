const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  distance: { type: Number, required: true },
});

module.exports = mongoose.model('Route', routeSchema);