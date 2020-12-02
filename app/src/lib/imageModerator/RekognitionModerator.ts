import { injectable } from 'inversify';
import * as AWS from 'aws-sdk';
import { IImageModerator } from './IImageModerator';
import { Logger } from '@overnightjs/logger';

AWS.config.update({
  region: process.env.AWS_REGION
});

@injectable()
export class RekognitionModerator implements IImageModerator {
  public async moderate(image: Buffer): Promise<boolean> {
    if (!process.env.REKOGNITION_MIN_CONFIDENCE) {
      throw new Error('REKOGNITION_MIN_CONFIDENCE not set');
    }
    const minConfidence: number = Number.parseFloat(process.env.REKOGNITION_MIN_CONFIDENCE);
    const rekognition = new AWS.Rekognition({apiVersion: '2016-06-27'});
    const params: AWS.Rekognition.DetectModerationLabelsRequest = {
      Image: {
        Bytes: image,
      },
      MinConfidence: minConfidence
    };

    const res: AWS.Rekognition.DetectModerationLabelsResponse = await rekognition.detectModerationLabels(params).promise();
    Logger.Info(res, true);
    
    if (res.ModerationLabels && res.ModerationLabels.length > 0) {
      return false;
    }

    return true;
  }
}
