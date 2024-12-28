const mongoose = require('mongoose');

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

module.exports = mongoose.model('Bus', BusSchema);
