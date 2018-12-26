Thing = require('../models/thingModel');
let uuidv5 = require('uuid/v5');
let uuidv1 = require('uuid/v1');

// Handle index actions
exports.index = function (req, res) {

    if (typeof req.query.lat !== 'string' || 
        typeof req.query.lng !== 'string' || 
        typeof req.query.radius !== 'string' ) {
        res.json({
            status: "error",
            message: "Missing position",
        });
        return;
    }

    if ( parseInt(req.query.radius) > 60000 ) {
        res.json({
            status: "warning",
            message: "Please zoom in",
        });
        return;
    }

    Thing.find({
        location: {
            $near: {
                $maxDistance: parseInt(req.query.radius),
                $geometry: {
                type: "Point",
                    coordinates: [parseFloat(req.query.lng), parseFloat(req.query.lat)]
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
            data: things
        });
    });

};

// Handle create thing actions
exports.create = function (req, res) {

    const thing = new Thing();
    const ts = new Date().getTime();

      //validation
    if (
        typeof req.body.user !== 'string' || 
        typeof req.body.type !== 'string' ||
        typeof req.body.lat !== 'string' ||
        typeof req.body.lng !== 'string' ||
        typeof req.body.images === 'undefined' ||
        typeof req.body.tags === 'undefined'
        ) {
        res.json({
            status: "error",
            message: "Unauthorized",
        });
        return;
    }

    if ( req.body.user.length < 10 ) {
        res.json({
            status: "error",
            message: "Unauthorized",
        });
        return;
    }

    thing._id = uuidv1();
    thing.availability = "full";
    thing.status = "live";
    thing.type = req.body.type;
    thing.timestamp = ts;
    thing.user = req.body.user;
    thing.tags = req.body.tags;
    thing.images = req.body.images;
    thing.updates = [{
        user: req.body.user,
        timestamp: ts,
        what: "create"
    }];
    thing.location.type = "Point";
    thing.location.coordinates = [parseFloat(req.body.lng), parseFloat(req.body.lat)];

    thing.save(function (err) {
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        }
        res.json({
            status: 'success',
            data: thing
        });
    });

};

// Handle view thing info
exports.view = function (req, res) {
    Thing.findById(req.params.thing_id, function (err, thing) {
        if (err)
            res.send(err);
        res.json({
            status: 'success',
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
                status: 'success',
                data: thing
            });
        });
    });

};
