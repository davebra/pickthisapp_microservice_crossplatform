let dotenv = require('dotenv').config();
let aws = require('aws-sdk');
aws.config.region = 'ap-southeast-2';

exports.index = function (req, res) {

    //validation
    if (
        typeof req.body.user !== 'string' ||
        typeof req.body.imagename !== 'string'
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

    // no file added
    if ( typeof req.files.file === 'undefined' ) {
            res.json({
                status: "error",
                message: "Bad request",
            });
            return;
    }

    // file too large
    if (req.files.file.truncated) {
        res.json({
            status: "error",
            message: "File exceed size limit",
        });
        return;
    }

    // file type not allowed
    if ( ![,'image/jpeg','image/png'].includes(req.files.file.mimetype ) ) {
        res.json({
            status: "error",
            message: "File not allowed. Allowed are: doc, docx, pdf, jpg, png.",
        });
        return;
    }

    const fileName = `things/${req.body.imagename}`;
    const s3 = new aws.S3();

    const s3Params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: fileName,
        ContentType: 'image/jpeg',
        ACL: 'public-read',
        Body: req.files.file.data // Buffer.from(..., 'base64')
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
            url: data.Location,
        });
    });
        
};
