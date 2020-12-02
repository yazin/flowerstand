import { Container } from 'inversify';
import Types from './src/lib/Types';
import { FlowerStandImageGenerator } from './src/lib/imageGenerator/FlowerStandImageGenerator';
import { IImageUploader } from './src/lib/ImageUploader/IImageUploader';
import { S3ImageUploader } from './src/lib/ImageUploader/S3ImageUploader';
import { IImageModerator } from './src/lib/imageModerator/IImageModerator';
import { RekognitionModerator } from './src/lib/imageModerator/RekognitionModerator';

const container = new Container();
container.bind<IImageUploader>(Types.ImageUploader).to(S3ImageUploader);
container.bind<FlowerStandImageGenerator>(Types.FlowerStandImageGenerator).to(FlowerStandImageGenerator);
container.bind<IImageModerator>(Types.ImageModerator).to(RekognitionModerator);

export default container;
