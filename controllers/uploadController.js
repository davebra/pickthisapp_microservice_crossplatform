let dotenv = require('dotenv').config();
let aws = require('aws-sdk');

const S3_BUCKET = process.env.S3_BUCKET_NAME;

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

    // validate user, with uuidv5 only for dev
    if (/^[0-9A-F]{8}-[0-9A-F]{4}-[5][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/.test(req.body.user)) {
        res.json({
            status: "error",
            message: "Unauthorized",
        });
        return;
    }

    const s3 = new aws.S3();
    const fileName = "things/" + req.body.imagename + ".jpg";
    const s3Params = {
        Bucket: S3_BUCKET,
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
            data: data,
        });
    });
        
};


