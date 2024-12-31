const mongoose = require('mongoose');

// Define your Bus schema
const BusSchema = new mongoose.Schema(
    {
        BusNumber: { type: String, required: true, unique: true },
        Capacity: { type: Number, required: true },
        Type: { type: String, enum: ['Luxury', 'Standard', 'Economy'], required: true },
        RouteID: { type: mongoose.Schema.Types.ObjectId, ref: 'Route', required: true }, // Reference to Route
        OperatorID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User (Operator)
    },
    { timestamps: true }
);

// Avoid OverwriteModelError by checking if the model already exists
module.exports = mongoose.models.Bus || mongoose.model('Bus', BusSchema);
