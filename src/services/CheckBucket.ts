import { S3 } from "aws-sdk";

/**
 * @param {S3} s3
 * @param bucket
 * @returns {Promise<{success:boolean; message: string; data:string;}>}
 */
export const checkBucket = async (s3: S3, bucket:string) => {
    try {
        await s3.headBucket({Bucket: bucket}).promise()
        return { success: true, message: "Bucket already Exist", data: {}};
    } catch (error) {
        return { success: false, message: "Error bucket don't exit", data: error };
    }
};