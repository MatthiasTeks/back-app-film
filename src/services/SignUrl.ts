import { config } from "../config";
import { s3 } from "./UploadToS3";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Sign url to get media files from S3 AWS Bucket
export const signUrl = async (key: string) => {
    const params = {
        Bucket: config.bucket_name,
        Key: key,
        Expires: 60 * 60,
    };

    try {
        await s3.headObject(params);
        const command = new GetObjectCommand(params);

        return await getSignedUrl(s3, command, {expiresIn: 60 * 60});
    } catch (err) {
        throw err;
    }
}
