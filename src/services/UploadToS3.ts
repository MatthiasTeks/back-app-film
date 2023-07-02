import { Upload } from "@aws-sdk/lib-storage";
import { S3, S3ClientConfig } from "@aws-sdk/client-s3";
import { config } from '../config';

const s3Config: S3ClientConfig = {
    credentials: {
        accessKeyId: config.aws_access_key_id,
        secretAccessKey: config.aws_secret_access_key,
    },
    region: config.aws_region,
};

export const s3 = new S3(s3Config);

export const deleteFileFromS3 = async (key: string): Promise<void> => {
    const params = {
        Bucket: config.bucket_name,
        Key: key,
    };

    await s3.deleteObject(params);
};

export const uploadFileToS3 = async (file: Express.Multer.File): Promise<string> => {
    const { originalname, mimetype, buffer } = file;

    const params = {
        Bucket: config.bucket_name,
        Key: originalname,
        Body: buffer,
        ContentType: mimetype,
    };

    await new Upload({
        client: s3,
        params
    }).done();

    return `https://${config.bucket_name}.s3.${config.aws_region}.amazonaws.com/${originalname}`;
};

export const uploadFilesToS3 = async (files: Express.Multer.File[]): Promise<string[]> => {
    const urls: string[] = [];

    for (const file of files) {
        const { originalname, mimetype, buffer } = file;

        const params = {
            Bucket: config.bucket_name,
            Key: originalname,
            Body: buffer,
            ContentType: mimetype,
        };

        await new Upload({
            client: s3,
            params,
        }).done();

        urls.push(`https://${config.bucket_name}.s3.${config.aws_region}.amazonaws.com/${originalname}`);
    }

    return urls;
};