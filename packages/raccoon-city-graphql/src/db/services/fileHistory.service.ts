import mongoose from 'mongoose';
import {FileHistoryModel} from '../models/fileHistory';
import {DataImageService} from './dataImageService';

export class FileHistoryDbService implements DataImageService {
    constructor(private apartmentComplexId: string, private fileName: string) {}

    public removeImage(imageUuid: string): Promise<void> {
        return undefined;
    }

    public async uploadImage(imageUuid: string, downloadUrl: string): Promise<void> {
        await FileHistoryModel.create({
            name: this.fileName,
            timestamp: new Date(),
            downloadUrl,
            apartmentComplex: mongoose.Types.ObjectId(this.apartmentComplexId)
        });
        return undefined;
    }
}
