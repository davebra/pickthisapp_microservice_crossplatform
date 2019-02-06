const mongoose = require('mongoose');
let uuidv1 = require('uuid/v1'); // library to create unique ids

// Setup schema
const userSchema = mongoose.Schema({
    _id: {
        type: String,
        require: true,
        default: uuidv1()
    },
    provider: {
        type: String,
        enum: ['google', 'facebook', 'ptatest'],
        required: [true, 'Invalid provider']
    },
    providerid: {
        type: String, // id from the provider (google, facebook)
        required: true
    },
    nickname: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['enabled', 'suspended', 'disabled'],
        default: 'enabled',
        required: true
    },
    timestamp: {
        type: Date,
        required: true,
        default: Date.now
    },
    phone: {
        type: String
    },
    email: {
        type: String,
        validate: {
            validator: function(v) {
              return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v);
            },
            message: props => `${props.value} is not a valid email address!`
        }
    }
});

// Export User model
const User = mongoose.model("users", userSchema);
module.exports = User;