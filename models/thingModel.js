let mongoose = require('mongoose');

// Setup schema
var thingSchema = mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    location: { // to use with $near mongodb function
        type: { type: String },
        coordinates: []
    },
    availability: {
        type: String, // full, medium, low, empty
        required: true
    },
    status: {
        type: String,
        required: true // live, paused, deleted, spam, inappropriate, duplicate
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
        what: String
    }]
});

// Export Thing model
var Thing = mongoose.model("things", thingSchema);
module.exports = Thing;