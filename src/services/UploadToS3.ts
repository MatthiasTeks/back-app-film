import { S3 } from "aws-sdk";
import { config } from "../config";

/**
 * @name uploadToS3
 * @param {S3} s3
 * @param {File} fileData?
 * @returns {Promise<{success:boolean; message: string; data: object;}>}
 */
export const uploadToS3 = async (s3: S3, fileData?: { fieldname: string; size: number; originalname: string; mimetype: string; buffer: Buffer; encoding: string }) => {
    try {
        const params = {
            Bucket: config.bucket_name,
            Key: fileData!.originalname,
            Body: fileData!.buffer
        };

        try {
            const res = await s3.upload(params).promise();
            return {success: true, message: "File Uploaded with Successfully", data: res.Location};
        } catch (error) {
            return {success: false, message: "Unable to Upload the file", data: error};
        }
    } catch (error) {
        return {success:false, message: "Unable to access this file", data: {}};
    }
}