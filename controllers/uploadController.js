const dotenv = require('dotenv').config();
const shortid = require('shortid');

// Handle upload action
exports.upload = function (req, res) {

    // no file added
    if ( typeof req.body.image === 'undefined' ) {
        return res.status(400).json({ message: "File missing." });
    }

    //set a unique filename with correct extension
    const fileName = `${shortid.generate()}.jpg`;

    // if AWS_S3_REGION is set to local, save images in uploads folder
    if( process.env.AWS_S3_REGION === 'local' ){

        const fs = require('fs');
        fs.writeFile(`${__dirname}/../uploads/${fileName}`, req.body.image, 'base64', (err) => {
            if (err) return res.status(500).send(err);

            return res.status(200).json({
                url: req.protocol + '://' + req.get('host') + '/uploads/' + fileName,
                filename: fileName
            });
        });

    } else {

        // import the aws-sdk library and set the region
        let aws = require('aws-sdk');
        aws.config.region = process.env.AWS_S3_REGION;

        // starting the S3 client and create the parameters of the S3 Object
        const s3 = new aws.S3();
        const s3Params = {
            Bucket: process.env.AWS_S3_BUCKET,
            Key: `things/${fileName}`,
            ContentType: 'image/jpeg',
            ACL: 'public-read',
            Body: Buffer.from(req.body.image, 'base64')
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
