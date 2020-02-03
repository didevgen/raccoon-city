import {Document, Model} from 'mongoose';
import {ImageType} from '../../services/image/imageService';
import {DataImageService} from './dataImageService';

export class HouseLayoutDbService<T extends Document & {images: any}> implements DataImageService {
    constructor(protected houseId: string, private mode: ImageType, private dbModel: Model<T>) {}

    public async uploadImage(imageUuid: string, downloadUrl: string, previewUrl?: string): Promise<void> {}

    public async removeImage(imageUuid: string): Promise<void> {}
}
