let mongoose = require('mongoose');

// Setup schema
var thingSchema = mongoose.Schema({
    location: {
        type: { type: String },
        coordinates: []
    },
    availability: {
        type: String, // full, medium, low, empty
        required: true
    },
    status: {
        type: String,
        required: true // live, paused, deleted, warn, ban, duplicate
    },
    type: {
        type: String, // pickup, contact
        required: true
    },
    timestamp: {
        type: Date,
        required: true,
        default: Date.now
    },
    user: {
        type: String,
        required: true
    },
    tags: [String],
    images: [String],
    updates: [{
        user: String, 
        timestamp: {
            type: Date,
            default: Date.now
        }, 
        what: Date
    }]
});

// Export Thing model
var Thing = module.exports = mongoose.model('things', thingSchema);
