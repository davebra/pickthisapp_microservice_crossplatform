let Thing = require('../models/thingModel');
let uuidv1 = require('uuid/v1');

// Handle index actions
exports.index = function (req, res) {

    // validation, center point and radius are required
    if (typeof req.query.lat !== 'string' || 
        typeof req.query.lng !== 'string' || 
        typeof req.query.radius !== 'string' ) {
        res.json({
            status: "error",
            message: "Missing position",
        });
        return;
    }

    // if radius is too big, ask to zoom
    if ( parseInt(req.query.radius) > 60000 ) {
        res.json({
            status: "warning",
            message: "Please zoom in",
        });
        return;
    }

    // execute the find action, with geometry, and return the objects
    Thing.find({
        status: "live",
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

    // create empty object
    const thing = new Thing();

    //validation of required fields
    // only for dev, user validation in JWT for production
    if (
        typeof req.body.user !== 'string' || 
        typeof req.body.type !== 'string' ||
        typeof req.body.lat === 'undefined' ||
        typeof req.body.lng === 'undefined' ||
        typeof req.body.images === 'undefined' ||
        typeof req.body.tags === 'undefined'
        ) {
        res.json({
            status: "error",
            message: "Unauthorized",
        });
        return;
    }

    // fill the object data
    thing._id = uuidv1();
    thing.availability = "full";
    thing.status = "live";
    thing.type = req.body.type;
    thing.user = req.body.user;
    thing.tags = req.body.tags;
    thing.images = req.body.images;
    thing.updates = [{
        user: req.body.user,
        what: "create"
    }];
    thing.location.type = "Point";
    thing.location.coordinates = [parseFloat(req.body.lng), parseFloat(req.body.lat)];

    // save the thing in mongodb
    thing.save(function (err) {
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
            return;
        }
        res.json({
            status: 'success',
            data: thing
        });
    });

};

// Handle view thing info
exports.view = function (req, res) {

    // find and return the object with id
    Thing.findById(req.params.thing_id, function (err, thing) {
        if (err){
            res.json({
                status: 'error',
                message: err
            });
            return;
        }
        res.json({
            status: 'success',
            data: thing
        });
    });
};

// Handle update thing info
exports.update = function (req, res) {

    // validation of required fields
    // only for dev, user validation in JWT for production
    if ( typeof req.body.user !== 'string' ) {
        res.json({
            status: "error",
            message: "Unauthorized",
        });
        return;
    }

    // find in database, update data and save
    Thing.findById(req.params.thing_id, function (err, thing) {
        if (err){
            res.json({
                status: 'error',
                message: err
            });
            return;
        }

        if (thing === null || thing === undefined){
            res.json({
                status: 'error',
                message: 'no thing found'
            });
            return;
        }

        var updatedWhat = "updated";

        // fill the object data
        if ( typeof req.body.availability === 'string' ) {
            thing.availability = req.body.availability;
            updatedWhat += " availability("+req.body.availability+")";
        }
        if ( typeof req.body.status === 'string' ) {
            thing.status = req.body.status;
            updatedWhat += " status("+req.body.status+")";
        }
        if ( typeof req.body.type === 'string' ) {
            thing.type = req.body.type;
            updatedWhat += " type("+req.body.type+")";
        }
        if ( typeof req.body.tags !== 'undefined' ) {
            thing.tags = req.body.tags;
            updatedWhat += " tags";
        }
        if ( typeof req.body.images !== 'undefined' ) {
            thing.tags = req.body.tags;
            updatedWhat += " images";
        }
        // if there are something updated, add what has been updated in the updates[]
        if (updatedWhat.length > 8){
            thing.updates.push({
                user: req.body.user,
                what: updatedWhat
            });
        }

        // save the thing and check for errors
        thing.save(function (err) {
            if (err){
                res.json({
                    status: 'error',
                    message: err
                });
                return;
            }
            res.json({
                status: 'success',
                data: thing
            });
        });
    });

};

// Handle userthings actions
exports.userthings = function (req, res) {

    // execute the find action, with geometry, and return the objects
    Thing.find({user: req.params.user_id, status: { $in: ["live", "paused"] }}).sort('-timestamp').exec(function (err, things) {
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
