const Thing = require('../models/thingModel');
const uuidv4 = require('uuid/v4');

// Handle list actions
exports.list = function (req, res) {

    // validation, center point and radius are required
    if (typeof req.query.lat !== 'string' || 
        typeof req.query.lng !== 'string' || 
        typeof req.query.radius !== 'string' ) {
        return res.status(400).json({
            message: "Missing position",
        });
    }

    // if radius is too big (too many things could be loaded), ask to zoom, max 100km
    if ( parseInt(req.query.radius) > 100000 ) {
        return res.status(400).json({
            message: "Please zoom in",
        });
    }

    // execute the find action, with geometry, and return the objects
    Thing.find({
        status: "live", // select only live things
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
        //if any error, return the error
        if (err) return res.status(500).send(err);

        return res.status(200).json(things);
    });

};

// Handle create thing actions
exports.create = function (req, res) {

    //validation of required fields
    if (
        typeof req.body.type !== 'string' ||
        typeof req.body.lat === 'undefined' ||
        typeof req.body.lng === 'undefined' ||
        typeof req.body.images === 'undefined' ||
        typeof req.body.tags === 'undefined'
        ) {
        return res.status(400).json({
            message: "Bad Request",
        });
    }

    // create object and fill
    let thing = new Thing();
    thing._id = uuidv4();
    thing.availability = "full";
    thing.status = "live";
    thing.type = req.body.type;
    thing.user = res.locals.user._id;
    thing.usernickname = res.locals.user.nickname;
    thing.tags = req.body.tags;
    thing.images = req.body.images;
    thing.updates = [{
        user: res.locals.user._id,
        usernickname: res.locals.user.nickname,
        what: "create"
    }];
    thing.location.type = "Point";
    thing.location.coordinates = [parseFloat(req.body.lng), parseFloat(req.body.lat)];

    // save the thing in mongodb
    thing.save(function (err) {
        if (err) return res.status(500).json(err);

        return res.status(200).json(thing);
    });

};

// Handle view thing info
exports.view = function (req, res) {

    // find and return the object with id
    Thing.findById(req.params.thing_id, function (err, thing) {
        if (err) return res.status(500).send(err);

        return res.status(200).json(thing);
    });

};

// Handle update thing info
exports.update = function (req, res) {

    // find in database, update data and save
    Thing.findById(req.params.thing_id, function (err, thing) {
        if (err) return res.status(500).send(err);

        if (thing === null || thing === undefined){
            return res.status(404).json({
                message: 'Thing not found'
            });
        }

        var updatedWhat = "updated";

        // fill the object data, if fields are sent in the request
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
            thing.images = req.body.images;
            updatedWhat += " images";
        }
        // if there are something updated, add what has been updated in the updates[]
        if (updatedWhat.length > 8){
            thing.updates.push({
                user: res.locals.user._id,
                usernickname: res.locals.user.nickname,
                what: updatedWhat
            });
        }

        // save the thing and check for errors
        thing.save(function (err) {
            if (err) return res.status(500).send(err);

            return res.status(200).json(thing);
        });
    });

};

// Handle userthings actions
exports.userthings = function (req, res) {

    //validation, user cannot retreive posts of another user
    if ( res.locals.user._id !== req.params.user_id ){
        return res.status(403).json({ message: "Not authorized" });
    }

    // execute the find action for the user, and return the objects
    Thing.find({user: req.params.user_id, status: { $in: ["live", "paused"] }}).sort('-timestamp').exec(function (err, things) {
        if (err) return res.status(500).send(err);

        return res.status(200).send(things);
    });

};
