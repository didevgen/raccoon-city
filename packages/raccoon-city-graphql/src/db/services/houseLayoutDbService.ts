import {Document, Model} from 'mongoose';
import {DataImageService} from './dataImageService';
import {HouseLayout} from '../models/houseLayout';

export class HouseLayoutDbService<T extends Document> implements DataImageService {
    constructor(protected layout: HouseLayout, private dbModel: Model<T>) {}

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
