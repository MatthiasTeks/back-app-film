import { S3 } from 'aws-sdk';
import { CreateBucketRequest } from 'aws-sdk/clients/s3';
import { config } from "../config";

/**
 * @name createBucket
 * @param {S3} s3
 * @returns {Promise<{success:boolean; message: string; data: string;}>}
 */
export const createBucket = async (s3: S3) => {

    const params: CreateBucketRequest = { Bucket: config.bucket_name,
        CreateBucketConfiguration: {
            LocationConstraint: "eu-west-3"
        }
    }

    try {
        const res = await s3.createBucket(params).promise();

        console.log("Bucket Created Successfully", res.Location);

        return {success: true, message: "Bucket Created Successfully",data: res.Location};
    } catch (error) {
        console.log("Error: Unable to create bucket \n", error);

        return {success: false, message: "Unable to create bucket", data: error};
    }
}