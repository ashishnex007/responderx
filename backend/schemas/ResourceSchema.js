const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    resourceType: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    condition: {
        type: String,
        required: true
    },
    donationTimeframe: {
        type: String,
    },
    location: {
        type: String,
        required: true
    },
    compliance: {
        type: Boolean,
    }
}, { timestamps: true });

module.exports = mongoose.model('Resource', ResourceSchema);