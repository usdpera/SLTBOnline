const mongoose = require('mongoose');

const RouteSchema = new mongoose.Schema({
    Origin: { type: String, required: true },
    Destination: { type: String, required: true },
    Distance: { type: String, required: true },
    Name: { type: String, required: true },
    RouteID: { type: String, required: true, unique: true },
}, { timestamps: true });

module.exports = mongoose.model('Route', RouteSchema);
