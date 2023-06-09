import * as dotenv from 'dotenv';

dotenv.config();

export const config: { aws_access_key_id: string, aws_secret_access_key:string, aws_region:string, bucket_name: string } = {
    aws_access_key_id : process.env.AWS_ACCESS_KEY_ID ?? " ",
    aws_secret_access_key : process.env.AWS_SECRET_ACCESS_KEY ?? '',
    aws_region : process.env.AWS_REGION ?? '',
    bucket_name: process.env.AWS_S3_BUCKET_NAME ?? 'test-bucket'
}