import {uuid} from 'uuidv4';
import * as fs from 'fs';
import {Readable} from 'stream';
import {LandingImageService} from './landingImage';

export enum ImageType {
    CHESS_GRID = 'CHESS_GRID',
    SITE = 'SITE',
    MOBILE = 'MOBILE',
    PHOTO = 'PHOTO',
    VR = 'VR',
    HALF_VR = 'HALF_VR'
}

export interface UploadedFile {
    filename: string;
    createReadStream(): Readable;
}

export interface ImageOperations {
    addImage(file): Promise<string>;
    removeImage(imageUuid: string): Promise<void>;
}

function getFileExtension(fileName: string): string {
    return fileName.split('.').pop();
}

function getFileUrl(newFileName: string): string {
    return `./uploadedFiles/${newFileName}`;
}

export class FileService extends LandingImageService {
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

    public async saveImageFile(file: UploadedFile): Promise<string[]> {
        const imageUuid = uuid();
        const fileUrl = getFileUrl(file.filename);
        const writeStream = fs.createWriteStream(fileUrl);
        const fileStream = file.createReadStream();
        const pipedStream = fileStream.pipe(writeStream);
        await new Promise((resolve, reject) => {
            pipedStream.on('finish', () => {
                resolve();
            });
        });
        return [fileUrl, imageUuid, file.filename];
    }
}
