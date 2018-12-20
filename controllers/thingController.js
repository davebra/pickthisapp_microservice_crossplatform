Thing = require('../models/thingModel');
let uuidv5 = require('uuid/v5');

// Handle index actions
exports.index = function (req, res) {

    if (typeof req.body.lat !== 'string' || 
        typeof req.body.lng !== 'string' || 
        typeof req.body.radius !== 'string' ) {
        res.json({
            status: "error",
            message: "Missing position",
        });
        return;
    }

    if ( parseInt(req.body.radius) > 60000 ) {
        res.json({
            status: "warning",
            message: "Please zoom in",
        });
        return;
    }
    
    Thing.get(function (err, things) {
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        }
        res.json({
            status: "success",
            message: "Things retrieved successfully",
            data: things
        });
    });

    Thing.find({
        location: {
            $near: {
                $maxDistance: parseInt(req.body.radius),
                $geometry: {
                type: "Point",
                    coordinates: [parseFloat(req.body.lng), parseFloat(req.body.lat)]
                }
            }
        }
    }).exec(function (err, things) {
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        }
        res.json({
            status: "success",
            message: "Things retrieved successfully",
            data: things
        });
    });

};

// Handle create thing actions
exports.new = function (req, res) {
    res.json({
        status: "warning",
        message: 'Not yet implemented'
    });
};

// Handle view thing info
exports.view = function (req, res) {
    Thing.findById(req.params.thing_id, function (err, thing) {
        if (err)
            res.send(err);
        res.json({
            message: 'Thing details loading..',
            data: thing
        });
    });
};

// Handle update thing info
exports.update = function (req, res) {

    Thing.findById(req.params.thing_id, function (err, thing) {
        if (err)
            res.send(err);

        thing.name = req.body.name ? req.body.name : thing.name;
        thing.gender = req.body.gender;
        thing.email = req.body.email;
        thing.phone = req.body.phone;

        // save the thing and check for errors
        thing.save(function (err) {
            if (err)
                res.json(err);
            res.json({
                message: 'Thing Info updated',
                data: thing
            });
        });
    });

};
