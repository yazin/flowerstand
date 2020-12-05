import { Container } from 'inversify';
import Types from './lib/Types';
import { FlowerStandImageGenerator } from './lib/imageGenerator/FlowerStandImageGenerator';
import { IImageUploader } from './lib/ImageUploader/IImageUploader';
import { S3ImageUploader } from './lib/ImageUploader/S3ImageUploader';
import { IImageModerator } from './lib/imageModerator/IImageModerator';
import { RekognitionModerator } from './lib/imageModerator/RekognitionModerator';

const container = new Container();
container.bind<IImageUploader>(Types.ImageUploader).to(S3ImageUploader);
container.bind<FlowerStandImageGenerator>(Types.FlowerStandImageGenerator).to(FlowerStandImageGenerator);
container.bind<IImageModerator>(Types.ImageModerator).to(RekognitionModerator);

export default container;
