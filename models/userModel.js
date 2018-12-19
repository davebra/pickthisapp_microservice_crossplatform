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
        type: String,
        required: true
    },
    things: Array
});

// Export User model
var User = module.exports = mongoose.model('users', userSchema);

module.exports.get = function (callback, limit) {
    User.find(callback).limit(limit);
}