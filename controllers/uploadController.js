let dotenv = require('dotenv').config();
let aws = require('aws-sdk');

aws.config.region = 'ap-southeast-2';

// Handle index actions
exports.index = function (req, res) {

    //validation
    // only for dev, user validation in JWT for production
    if (
        typeof req.body.user !== 'string' ||
        typeof req.body.imagename !== 'string' ||
        typeof req.body.image === 'undefined'
        ) {
            res.json({
                status: "error",
                message: "Bad request",
            });
            return;
    }

    // starting the S3 client and create the parameters of the S3 Object
    const s3 = new aws.S3();
    const fileName = "things/" + req.body.imagename;
    const s3Params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: fileName,
        ContentType: 'image/jpeg',
        ACL: 'public-read',
        Body: Buffer.from(req.body.image, 'base64')
    };

    // execute the upload to S3
    s3.upload(s3Params, function (err, data) {
        if (err) {
            res.json({
                status: "error",
                data: err,
            });
            return;
        }
        res.json({
            status: "success",
            message: 'uploaded',
        });
    });
        
};
