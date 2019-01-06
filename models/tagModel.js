let mongoose = require('mongoose');

// Setup schema
var tagSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    items: Number
});

// Export Tag model
var Tag = module.exports = mongoose.model('tags', tagSchema);

// Export method for get all tags
module.exports.getAll = function (callback) {
    Tag.find().limit(5).sort('-items').select('name -_id').exec(callback);
}

// Export method for get tags starting with
module.exports.getByStart = function (callback, letters) {
    Tag.find({"name" : {$regex : letters+".*"}}).limit(5).sort('-items').select('name  -_id').exec(callback);
}