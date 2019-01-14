const dotenv = require('dotenv').config();
const mime = require('mime'); // library to recognize the mime type of the file added
const aws = require('aws-sdk'); // library to connect to aws services
const uuidv4 = require('uuid/v4'); // library for generate unique ids

aws.config.region = process.env.AWS_S3_REGION;

// Handle upload action
exports.upload = function (req, res) {

    // no file added
    if ( typeof req.files.file === 'undefined' ) {
        return res.status(400).json({ message: "Bad request." });
    }

    // file too large
    if (req.files.file.truncated) {
        return res.status(400).json({ message: "Bad request." });
    }

    // file type not allowed
    if ( !['image/jpeg','image/png'].includes(req.files.file.mimetype ) ) {
        return res.status(400).json({ message: "File not allowed. Allowed are: jpg, png." });
    }

    //set a unique filename with correct extension
    const fileName = `${uuidv4()}.${mime.getExtension(req.files.file.mimetype)}`;

    // if S3_BUCKET_NAME is set to local, save images in uploads folder
    if( process.env.AWS_S3_BUCKET === 'local' ){

        const fs = require('fs');
        fs.writeFile(`${__dirname}/../uploads/${fileName}`, req.files.file.data, (err) => {
            if (err) return res.status(500).send(err);

            return res.status(200).json({
                url: req.protocol + '://' + req.get('host') + '/uploads/' + fileName,
                filename: fileName
            });
        });

    } else {

        // starting the S3 client and create the parameters of the S3 Object
        const s3 = new aws.S3();
        const s3Params = {
            Bucket: process.env.AWS_S3_BUCKET,
            Key: `things/${fileName}`,
            ContentType: req.files.file.mimetype,
            ACL: 'public-read',
            Body: req.files.file.data
        };

        // execute the upload to S3
        s3.upload(s3Params, function (err, data) {
            if (err)  return res.status(500).send(err);

            return res.status(200).json({
                url: data.Location,
                filename: fileName
            });
        });

    }
        
};
