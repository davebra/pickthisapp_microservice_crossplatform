let dotenv = require('dotenv').config();
let aws = require('aws-sdk');

aws.config.region = 'ap-southeast-2';

// Handle index actions
exports.index = function (req, res) {

    //validation
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

    const s3 = new aws.S3();
    const fileName = "things/" + req.body.imagename;
    const s3Params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: fileName,
        ContentType: 'image/jpeg',
        ACL: 'public-read',
        Body: Buffer.from(req.body.image, 'base64')
    };

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
