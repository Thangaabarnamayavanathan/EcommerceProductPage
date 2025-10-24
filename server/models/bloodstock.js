const mongoose = require('mongoose');

const BloodStockSchema = new mongoose.Schema({
    bloodGroup: {
        type: String,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
        required: true
    },
    unit: {
        type: Number, // In mL or actual units (e.g., 1 unit = 350ml)
        required: true,
        min: 0
    },
    bloodBank: { // Reference to the User who is a blood bank
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('BloodStock', BloodStockSchema);