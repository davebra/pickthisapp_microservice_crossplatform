const mongoose = require('mongoose');

// Setup schema
const tagSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});

// Export Tag model
const Tag = module.exports = mongoose.model('tags', tagSchema);

// Export method for get all tags
module.exports.getAll = function (callback) {
    Tag.find().limit(5).select('name -_id').exec(callback);
}

// Export method for get tags starting with
module.exports.getByStart = function (letters, callback) {
    Tag.find({"name" : {$regex : letters+".*"}}).limit(5).select('name  -_id').exec(callback);
}