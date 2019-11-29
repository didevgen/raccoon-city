import * as admin from 'firebase-admin';
import {ApartmentComplexLandingImageService} from '../../db/services/apartmentComplex/landingImage.service';
import {ApartmentComplexVRImageService} from '../../db/services/apartmentComplex/vrImage.service';
import {ImageOperations, ImageType} from './imageService';
import {FirebaseImageUploader} from './imageUploader';
import {LandingImageService} from './landingImage';
import {PhotosService} from './photos';
import {VRImageService} from './vrImage';

export class ApartmentComplexImageServiceFactory {
    constructor(private mode: ImageType) {}

    public getImageService(firebase: admin.app.App, apartmentComplexId: string, name?: string): ImageOperations {
        if ([ImageType.CHESS_GRID, ImageType.MOBILE, ImageType.SITE].includes(this.mode)) {
            return new LandingImageService(
                new FirebaseImageUploader(firebase, apartmentComplexId),
                new ApartmentComplexLandingImageService(apartmentComplexId, this.mode)
            );
        }

        if ([ImageType.HALF_VR, ImageType.VR].includes(this.mode)) {
            return new VRImageService(
                new FirebaseImageUploader(firebase, apartmentComplexId),
                new ApartmentComplexVRImageService(apartmentComplexId, this.mode, name)
            );
        }

        if (this.mode === ImageType.PHOTO) {
            return new PhotosService(
                new FirebaseImageUploader(firebase, apartmentComplexId),
                new ApartmentComplexVRImageService(apartmentComplexId, this.mode, name)
            );
        }
    }
}
