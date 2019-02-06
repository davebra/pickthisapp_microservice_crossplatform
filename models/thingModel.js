const mongoose = require('mongoose');
const shortid = require('shortid');

// Setup schema
const thingSchema = mongoose.Schema({
    _id: {
        type: String,
        default: shortid.generate()
    },
    location: { // to use with $near mongodb function
        type: { type: String },
        coordinates: []
    },
    availability: {
        type: String,
        enum: ['full', 'medium', 'low', 'empty'],
        required: true
    },
    status: {
        type: String,
        enum: ['live', 'paused', 'deleted', 'spam', 'inappropriate', 'duplicate'],
        required: true
    },
    type: {
        type: String, // pickup, contact
        enum: ['pickup', 'contact'],
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
    usernickname: {
        type: String,
        required: true
    },
    tags: {
        type: [String],
        required: true
    },
    images: {
        type: [String],
        required: true
    },
    updates: [{
        user: String, 
        usernickname: String, 
        timestamp: {
            type: Date,
            default: Date.now
        }, 
        what: String
    }]
});

// Export Thing model
const Thing = mongoose.model("things", thingSchema);
module.exports = Thing;