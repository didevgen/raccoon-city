import fs from 'fs';
import {Uploadable} from '../firebase/fbImageUploader';

import AWS from 'aws-sdk';
import {ManagedUpload} from 'aws-sdk/lib/s3/managed_upload';
import SendData = ManagedUpload.SendData;

const s3 = new AWS.S3();

export class S3ImageUploader implements Uploadable {
    constructor(private prefix: string) {}

    public async upload(fileUrl: string, fileName: string): Promise<string> {
        const fileContent = fs.readFileSync(fileUrl);
        const Key = `images/${this.prefix}/${fileName}`;
        const params = {
            Bucket: process.env.AWS_S3_BUCKET,
            Key: `raccoon-city-ui-dev/${Key}`,
            Body: fileContent
        };

        const uploadPromise = new Promise<SendData>((resolve, reject) => {
            s3.upload(params, (err, data) => {
                if (err) {
                    reject(err);
                    throw new Error(`upload error ${err.message}`);
                } else {
                    resolve(data);
                }
            });
        });
        const sendData: SendData = await uploadPromise;
        if (sendData.Location) {
            return `${process.env.AWS_CLOUDFRONT_URL}/${Key}`;
        }
    }

    public async remove(imageUuid: string): Promise<void> {
        const listParams = {
            Bucket: process.env.AWS_S3_BUCKET,
            Prefix: `raccoon-city-ui-dev/images/${this.prefix}/${imageUuid}`
        };

        const listedObjects = await s3.listObjectsV2(listParams).promise();

        if (listedObjects.Contents.length === 0) {
            return;
        }

        const deleteParams = {
            Bucket: process.env.AWS_S3_BUCKET,
            Delete: {Objects: []}
        };

        listedObjects.Contents.forEach(({Key}) => {
            deleteParams.Delete.Objects.push({Key});
        });

        await s3.deleteObjects(deleteParams).promise();

        if (listedObjects.IsTruncated) {
            await this.remove(imageUuid);
        }
    }
}
