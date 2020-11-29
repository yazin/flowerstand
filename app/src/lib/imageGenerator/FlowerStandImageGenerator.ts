import fs from 'fs';
import { injectable, inject } from 'inversify';
import axios, { AxiosResponse } from 'axios';
import sharp from 'sharp';
import { TextToImageConverter } from './TextToImageConverter';
import { IImageUploader } from '../ImageUploader/IImageUploader';
import Types from '../Types';

export interface IPanelData {
  data: Buffer;
  ext: string;
  contentType: string;
}

@injectable()
export class FlowerStandImageGenerator {
  private readonly converter: TextToImageConverter;
  private readonly uploader: IImageUploader;

  constructor(@inject(Types.ImageUploader) uploader: IImageUploader) {
    this.converter = new TextToImageConverter();
    this.uploader = uploader;
  }

  public async generateFlowerStandImage(baseDesignUrl: string, prefix: string, presentTo: string, presentFrom: string, eventName: string, panel: IPanelData | null = null, isPreview: boolean = false): Promise<string> {
    const res: AxiosResponse<ArrayBuffer> = await axios.get<ArrayBuffer>(baseDesignUrl, {responseType: 'arraybuffer', headers: {'Content-Type': 'image/png'}});
    if (res.status !== 200) {
      throw new Error(`S3 respond ${res.status} for ${baseDesignUrl}`);
    }

    const fromSvg: string = this.converter.createPresentFrom(presentFrom);
    const toSvg: string = this.converter.createPresetnTo(presentTo, prefix);
    const eventNameSvg: string = this.converter.createEventName(eventName);

    const imageFile: Buffer = await this.compositeImage(Buffer.from(res.data), toSvg, fromSvg, eventNameSvg, panel);

    const imageUrl: string = await this.uploader.upload(imageFile, isPreview);

    return imageUrl;
  }

  private async compositeImage(baseDesignImage: Buffer, toSvg: string, fromSvg: string, eventNameSvg: string, panel: IPanelData | null): Promise<Buffer> {
    const fromBuffer: Buffer = Buffer.from(fromSvg);
    const toBuffer: Buffer = Buffer.from(toSvg);
    const eventNameBuffer: Buffer = Buffer.from(eventNameSvg);
    const fromImage: sharp.Sharp = sharp('./resource/image/frame_from.png')
      .composite([
        {
          input: await sharp(fromBuffer)
            .resize(580, 75, {fit: sharp.fit.inside})
            .toBuffer()
        }]);

    const toImage: sharp.Sharp = sharp('./resource/image/frame_to.png')
      .composite([
        {
          input: await sharp(toBuffer)
            .resize(640, 75, {fit: sharp.fit.inside})
            .extend({top: 0, left: 0, bottom: 25, right: 0, background: {r: 255, g: 255, b: 255, alpha: 0}})
            .toBuffer(),
          gravity: sharp.gravity.south
        },
        {
          input: await sharp(eventNameBuffer)
            .resize(640, 30, {fit: sharp.fit.inside})
            .extend({top: 20, left: 0, bottom: 0, right: 0, background: {r: 255, g: 255, b: 255, alpha: 0}})
            .toBuffer(),
          gravity: sharp.gravity.north
        }
      ]);

    const resultImage: sharp.Sharp = sharp({
      create: {
        width: 810,
        height: 1340,
        channels: 3,
        background: {r: 255, g: 255, b: 255}
      }
    });

    if (panel) {
      let uploadedPanelImage: Buffer = await sharp(panel.data)
        .resize(750)
        .toBuffer();

      const meta: sharp.Metadata = await sharp(uploadedPanelImage).metadata()
      if (meta.height && meta.height > 563) {
        uploadedPanelImage = await sharp(uploadedPanelImage)
          .extract({top: 0, left: 0, width: 750, height: 563})
          .toBuffer();
      }

      return await resultImage.composite([
        {input: baseDesignImage, gravity: sharp.gravity.south},
        {input: await toImage.toBuffer(), gravity: sharp.gravity.north},
        {input: await fromImage.toBuffer(), top: 550, left: 55},
        {input: uploadedPanelImage, top: 700, left: 30}
      ]).png().toBuffer();
    } else {
      return await resultImage.composite([
        {input: baseDesignImage, gravity: sharp.gravity.south},
        {input: await toImage.toBuffer(), gravity: sharp.gravity.north},
        {input: await fromImage.toBuffer(), top: 550, left: 55}
      ]).png().toBuffer();
    }
  }
}
