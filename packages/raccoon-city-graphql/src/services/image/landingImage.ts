import * as fs from 'fs';
import {ImageService} from './imageService';

export class LandingImageService extends ImageService {
    public async addImage(file): Promise<string> {
        const [fileUrl, imageUuid, newFileName] = await this.saveImageFile(file);

        try {
            const downloadUrl = await this.uploader.upload(fileUrl, newFileName);
            await this.dataImageService.uploadImage(imageUuid, downloadUrl);
            return downloadUrl;
        } finally {
            fs.unlinkSync(fileUrl);
        }
    }

    public removeImage(imageUuid: string): Promise<void> {
        return undefined;
    }
}
