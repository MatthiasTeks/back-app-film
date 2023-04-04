"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFileToS3 = exports.deleteFileFromS3 = exports.s3 = void 0;
const lib_storage_1 = require("@aws-sdk/lib-storage");
const client_s3_1 = require("@aws-sdk/client-s3");
const config_1 = require("../config");
// Create an S3 instance with the AWS API credentials
const s3Config = {
    credentials: {
        accessKeyId: config_1.config.aws_access_key_id,
        secretAccessKey: config_1.config.aws_secret_access_key,
    },
    region: config_1.config.aws_region,
};
exports.s3 = new client_s3_1.S3(s3Config);
const deleteFileFromS3 = (key) => __awaiter(void 0, void 0, void 0, function* () {
    const params = {
        Bucket: config_1.config.bucket_name,
        Key: key,
    };
    yield exports.s3.deleteObject(params);
});
exports.deleteFileFromS3 = deleteFileFromS3;
// Function to upload a file to an S3 bucket
const uploadFileToS3 = (file) => __awaiter(void 0, void 0, void 0, function* () {
    // Retrieving information from the file
    const { originalname, mimetype, buffer } = file;
    // Construction of the object to be sent to S3
    const params = {
        Bucket: config_1.config.bucket_name,
        Key: originalname,
        Body: buffer,
        ContentType: mimetype,
    };
    // Sending the file to S3
    yield new lib_storage_1.Upload({
        client: exports.s3,
        params
    }).done();
    // Forwarding the file URL to S3
    return `https://${config_1.config.bucket_name}.s3.${config_1.config.aws_region}.amazonaws.com/${originalname}`;
});
exports.uploadFileToS3 = uploadFileToS3;
//# sourceMappingURL=UploadToS3.js.map