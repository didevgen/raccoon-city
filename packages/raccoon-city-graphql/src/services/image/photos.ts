import * as fs from 'fs';
import {LandingImageService} from './landingImage';

export class PhotosService extends LandingImageService {
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

    public async removeImage(imageUuid: string): Promise<void> {
        await this.dataImageService.removeImage(imageUuid);
        await this.uploader.remove(imageUuid);
    }
}
