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

module.exports.getAll = function (callback) {
    Tag.find().limit(5).sort('-items').select('name').exec(callback);
}

module.exports.getByStart = function (callback, letters) {
    Tag.find({"name" : {$regex : letters+".*"}}).limit(5).sort('-items').select('name').exec(callback);
}