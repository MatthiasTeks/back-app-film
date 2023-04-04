import {S3} from 'aws-sdk';

import {config} from '../config';

// Create an S3 instance with the AWS API credentials
export const s3 = new S3({
    accessKeyId: config.aws_access_key_id,
    secretAccessKey: config.aws_secret_access_key,
});

export const deleteFileFromS3 = async (key: string): Promise<void> => {
    const params = {
        Bucket: config.bucket_name,
        Key: key,
    };

    await s3.deleteObject(params).promise();
};

// Function to upload a file to an S3 bucket
export const uploadFileToS3 = async (file: Express.Multer.File): Promise<string> => {
    // Retrieving information from the file
    const { originalname, mimetype, buffer } = file;

    // Construction of the object to be sent to S3
    const params = {
        Bucket: config.bucket_name,
        Key: originalname,
        Body: buffer,
        ContentType: mimetype,
    };

    // Sending the file to S3
    const s3Response = await s3.upload(params).promise();

    // Forwarding the file URL to S3
    return s3Response.Location;
};

// Function to upload multiple files to an S3 bucket
export const uploadFilesToS3 = async (files: Express.Multer.File[]): Promise<string[]> => {
    // Creation of a table of promises for the sending of each file
    const promises = files.map(async (file) => {
        return await uploadFileToS3(file);
    });

    // Return file URLs to S3
    return await Promise.all(promises);
};