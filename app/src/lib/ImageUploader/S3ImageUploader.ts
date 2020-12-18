import * as AWS from 'aws-sdk';
import { injectable } from 'inversify';
import { v4 as uuidv4 } from 'uuid';
import { IImageUploader } from './IImageUploader';

AWS.config.update({
  region: process.env.AWS_REGION
});

@injectable()
export class S3ImageUploader implements IImageUploader {
  public async upload(imageFile: Buffer, isPreview: boolean): Promise<string> {
    if (!process.env.AWS_REGION) {
      throw new Error('AWS_REGION not specified');
    }

    if (!process.env.S3_BUCKET) {
      throw new Error('S3_BUCKET not specified');
    }

    const key: string = isPreview ? `preview/${uuidv4()}.png` : `public/${uuidv4()}.png`;

    const s3: AWS.S3 = new AWS.S3({apiVersion: '2006-03-01'});
    const params: AWS.S3.PutObjectRequest = {
      Bucket: process.env.S3_BUCKET,
      Key: key,
      Body: imageFile
    };

    await s3.putObject(params).promise();

    return `https://${process.env.S3_BUCKET}.s3-${process.env.AWS_REGION}.amazonaws.com/${key}`;
  }
}
