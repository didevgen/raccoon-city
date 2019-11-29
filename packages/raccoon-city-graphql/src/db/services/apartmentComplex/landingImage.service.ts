import ApartmentComplexModel from '../../models/apartmentComplex';
import {DataImageService} from '../dataImageService';
import {ImageType} from '../../../services/image/imageService';

export class ApartmentComplexLandingImageService implements DataImageService {
    constructor(protected apartmentComplexId: string, private mode: ImageType) {}

    public async uploadImage(imageUuid: string, downloadUrl: string, previewUrl?: string): Promise<void> {
        await ApartmentComplexModel.findById(this.apartmentComplexId, (err, apartmentComplex) => {
            const images = apartmentComplex.images ? apartmentComplex.images : {};
            // @ts-ignore
            images[this.mode] = {
                uuid: imageUuid,
                downloadUrl
            };
            apartmentComplex.images = images;
            apartmentComplex.save();
        });
    }

    public async removeImage(imageUuid: string): Promise<void> {}
}
