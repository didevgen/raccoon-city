import {PreviewImage} from 'shared';
import ApartmentComplexModel from '../../models/apartmentComplex';
import {DataImageService} from '../dataImageService';
import {ImageType} from '../../../services/image/imageService';

export class ApartmentComplexVRImageService implements DataImageService {
    constructor(protected apartmentComplexId: string, private mode: ImageType, private name: string) {}

    public async uploadImage(imageUuid: string, downloadUrl: string, previewUrl?: string): Promise<void> {
        await ApartmentComplexModel.findById(this.apartmentComplexId, (err, apartmentComplex) => {
            const images = apartmentComplex.images ? apartmentComplex.images : {};
            const newImage: PreviewImage = {
                uuid: imageUuid,
                downloadUrl,
                name: this.name,
                previewImageUrl: previewUrl
            };

            if (!images[this.mode]) {
                // @ts-ignore
                images[this.mode] = [newImage];
            } else {
                // @ts-ignore
                images[this.mode].push(newImage);
            }

            apartmentComplex.images = images;
            apartmentComplex.save();
        });
    }

    public async removeImage(imageUuid: string): Promise<void> {
        await ApartmentComplexModel.findById(this.apartmentComplexId, (err, apartmentComplex) => {
            const images = apartmentComplex.images;
            // @ts-ignore
            images[this.mode] = (images[this.mode] as PreviewImage[]).filter((image) => image.uuid !== imageUuid);
            apartmentComplex.images = images;
            apartmentComplex.save();
        });
    }
}
