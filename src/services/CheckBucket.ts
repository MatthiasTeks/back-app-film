import { S3 } from "aws-sdk";
/**
 * @name checkBucket
 * @param {S3} s3
 * @param bucket
 * @returns {Promise<{success:boolean; message: string; data:string;}>}
 */
export const checkBucket = async (s3: S3, bucket:string) => {
    try {
        const res =  await s3.headBucket({Bucket: bucket}).promise()

        console.log("Bucket already Exist", res.$response.data);

        return { success: true, message: "Bucket already Exist", data: {}};
    } catch (error) {

        console.log("Error bucket don't exit", error);

        return { success: false, message: "Error bucket don't exit", data: error };
    }
};