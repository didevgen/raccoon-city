import {Uploadable} from '../../firebase/fbImageUploader';
import {DataImageService} from '../../db/services/dataImageService';
import {uuid} from 'uuidv4';
import * as fs from 'fs';
import {Readable} from 'stream';

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

export abstract class ImageService implements ImageOperations {
    constructor(protected uploader: Uploadable, protected dataImageService: DataImageService) {}
    public abstract addImage(file): Promise<string>;

    public abstract removeImage(imageUuid: string): Promise<void>;

    public async saveImageFile(file: UploadedFile): Promise<string[]> {
        const imageUuid = uuid();
        const newFileName = `${imageUuid}.${getFileExtension(file.filename)}`;
        const fileUrl = getFileUrl(newFileName);
        const writeStream = fs.createWriteStream(fileUrl);
        const fileStream = file.createReadStream();
        const pipedStream = fileStream.pipe(writeStream);
        await new Promise((resolve, reject) => {
            pipedStream.on('finish', () => {
                resolve();
            });
        });
        return [fileUrl, imageUuid, newFileName];
    }
}
