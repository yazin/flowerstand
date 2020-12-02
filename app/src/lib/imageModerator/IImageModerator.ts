export interface IImageModerator {
  moderate(image: Buffer): Promise<boolean>
}
