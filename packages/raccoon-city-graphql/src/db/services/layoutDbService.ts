import {Document, Model} from 'mongoose';
import {SinglePreviewImage} from '../../types/shared';
import {DataImageService} from './dataImageService';

interface ImageLayout extends Document {
    image: SinglePreviewImage;
}

export class LayoutDbService<T extends Document> implements DataImageService {
    constructor(protected layout: ImageLayout, private dbModel: Model<T>) {}

    public async uploadImage(imageUuid: string, downloadUrl: string, previewUrl?: string): Promise<void> {
        this.layout.image = {
            uuid: imageUuid,
            downloadUrl,
            previewImageUrl: previewUrl
        };

        await this.layout.save();
    }

    public async removeImage(imageUuid: string): Promise<void> {}
}
