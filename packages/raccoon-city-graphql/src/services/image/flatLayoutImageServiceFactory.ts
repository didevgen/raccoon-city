import {S3ImageUploader} from '../../aws/s3ImageUploader';
import {HouseLayoutModel} from '../../db/models/houseLayout';
import {VRImageDbService} from '../../db/services/images/VRImageDbService';
import {ImageOperations, ImageType} from './imageService';
import {PhotosService} from './photos';
import {VRImageService} from './vrImage';

export class FlatLayoutImageServiceFactory {
    constructor(private mode: ImageType) {}

    public getImageService(apartmentComplexId: string, name?: string): ImageOperations {
        if ([ImageType.HALF_VR, ImageType.VR].includes(this.mode)) {
            return new VRImageService(
                new S3ImageUploader(apartmentComplexId),
                new VRImageDbService(apartmentComplexId, this.mode, name, HouseLayoutModel)
            );
        }

        if (this.mode === ImageType.PHOTO) {
            return new PhotosService(
                new S3ImageUploader(apartmentComplexId),
                new VRImageDbService(apartmentComplexId, this.mode, name, HouseLayoutModel)
            );
        }
    }
}
