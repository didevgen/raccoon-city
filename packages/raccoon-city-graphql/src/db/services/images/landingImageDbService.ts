import {DataImageService} from '../dataImageService';
import {ImageType} from '../../../services/image/imageService';
import {Document, Model} from 'mongoose';

export class LandingImageDbService<T extends Document & {images: any}> implements DataImageService {
    constructor(protected apartmentComplexId: string, private mode: ImageType, private dbModel: Model<T>) {}

    public async uploadImage(imageUuid: string, downloadUrl: string, previewUrl?: string): Promise<void> {
        await this.dbModel.findById(this.apartmentComplexId, (err, apartmentComplex) => {
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
