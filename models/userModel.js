let mongoose = require('mongoose');

// Setup schema
var userSchema = mongoose.Schema({
    _id: String,
    provider: {
        type: String,
        required: true
    },
    providerid: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    fullname: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        required: true,
        default: Date.now
    },
    things: [String]
});

// Export User model
var User = mongoose.model("users", userSchema);
module.exports = User;