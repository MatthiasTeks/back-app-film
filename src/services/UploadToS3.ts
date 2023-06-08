import { Upload } from "@aws-sdk/lib-storage";
import { S3, S3ClientConfig } from "@aws-sdk/client-s3";
import { config } from '../config';

// Create an S3 instance with the AWS API credentials
const s3Config: S3ClientConfig = {
    credentials: {
        accessKeyId: config.aws_access_key_id,
        secretAccessKey: config.aws_secret_access_key,
    },
    region: config.aws_region,
};

export const s3 = new S3(s3Config);

// Delete specific file from S3 bucket
export const deleteFileFromS3 = async (key: string): Promise<void> => {
    const params = {
        Bucket: config.bucket_name,
        Key: key,
    };

    await s3.deleteObject(params);
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

    // Sending file to S3
    await new Upload({
        client: s3,
        params
    }).done();

    // Forwarding the file URL to S3
    return `https://${config.bucket_name}.s3.${config.aws_region}.amazonaws.com/${originalname}`;
};

// Upload file from S3 bucket
export const uploadFilesToS3 = async (files: Express.Multer.File[]): Promise<string[]> => {
    const urls: string[] = [];

    for (const file of files) {
        // Retrieving information from the file
        const { originalname, mimetype, buffer } = file;

        // Construction of the object to be sent to S3
        const params = {
            Bucket: config.bucket_name,
            Key: originalname,
            Body: buffer,
            ContentType: mimetype,
        };

        // Sending file to S3
        await new Upload({
            client: s3,
            params,
        }).done();

        // Ajout de l'URL du fichier à la liste des URLs
        urls.push(`https://${config.bucket_name}.s3.${config.aws_region}.amazonaws.com/${originalname}`);
    }

    // Forwarding the file array URL to S3
    return urls;
};