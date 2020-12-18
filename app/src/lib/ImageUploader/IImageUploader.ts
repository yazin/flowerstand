export interface IImageUploader {
  upload(imageFile: Buffer, isPreview: boolean): Promise<string>;
}
