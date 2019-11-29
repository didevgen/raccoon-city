import * as fs from 'fs';
import sharp from 'sharp';
import {ImageService} from './imageService';

export class VRImageService extends ImageService {
    public async addImage(file): Promise<string> {
        const [fileUrl, imageUuid, newFileName] = await this.saveImageFile(file);
        const [previewImageUrl, uuid, newPreviewName] = await this.compressImage(fileUrl, imageUuid);
        try {
            const downloadUrl = await this.uploader.upload(fileUrl, newFileName);
            const downloadPreviewUrl = await this.uploader.upload(previewImageUrl, newPreviewName);
            await this.dataImageService.uploadImage(imageUuid, downloadUrl, downloadPreviewUrl);
            return downloadUrl;
        } finally {
            fs.unlinkSync(fileUrl);
            fs.unlinkSync(previewImageUrl);
        }
    }

    public async removeImage(imageUuid: string): Promise<void> {
        await this.dataImageService.removeImage(imageUuid);
        await this.uploader.remove(imageUuid);
    }

    private async compressImage(fileUrl, originalName) {
        const newFileName = `./uploadedFiles/${originalName}x320.jpg`;
        await sharp(fileUrl)
            .resize(320, 240)
            .toFile(newFileName);
        return [newFileName, originalName, `${originalName}x320.jpg`];
    }
}
