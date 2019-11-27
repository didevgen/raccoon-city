import ApartmentComplexModel from '../../db/models/apartmentComplex';
import {PreviewImage, SingleImage} from 'shared';
import {uuid} from 'uuidv4';
import * as fs from 'fs';
import sharp from 'sharp';

export enum ImageType {
    CHESS_GRID = 'CHESS_GRID',
    SITE = 'SITE',
    MOBILE = 'MOBILE',
    PHOTO = 'PHOTO',
    VR = 'VR',
    HALF_VR = 'HALF_VR'
}

export interface AppendImageParams {
    mode: ImageType;
    apartmentComplexId: string;
    imageUuid: string;
    downloadUrl: string;
    name?: string;
}

export interface AppendPreviewImageParams extends AppendImageParams {
    previewImageUrl: string;
}

function getFileExtension(fileName: string): string {
    return fileName.split('.').pop();
}

async function addSingleImage(params: AppendImageParams) {
    await ApartmentComplexModel.findById(params.apartmentComplexId, (err, apartmentComplex) => {
        const images = apartmentComplex.images ? apartmentComplex.images : {};
        const newImage: SingleImage = {
            uuid: params.imageUuid,
            downloadUrl: params.downloadUrl
        };

        // @ts-ignore
        images[params.mode] = newImage;
        apartmentComplex.images = images;
        apartmentComplex.save();
    });
}

async function addPreviewImage(params: AppendPreviewImageParams) {
    await ApartmentComplexModel.findById(params.apartmentComplexId, (err, apartmentComplex) => {
        const images = apartmentComplex.images ? apartmentComplex.images : {};
        const newImage: PreviewImage = {
            uuid: params.imageUuid,
            downloadUrl: params.downloadUrl,
            name: params.name,
            previewImageUrl: params.previewImageUrl
        };

        if (!images[params.mode]) {
            // @ts-ignore
            images[params.mode] = [newImage];
        } else {
            // @ts-ignore
            images[params.mode].push(newImage);
        }

        apartmentComplex.images = images;
        apartmentComplex.save();
    });
}

async function compressImage(fileUrl) {
    const imageUuid = uuid();
    const newFileName = `./uploadedFiles/${imageUuid}.jpg`;
    await sharp(fileUrl)
        .resize(320, 240)
        .toFile(newFileName);
    return [newFileName, imageUuid, `${imageUuid}.jpg`];
}

export async function saveImage(file): Promise<string[]> {
    const imageUuid = uuid();
    const newFileName = `${imageUuid}.${getFileExtension(file.filename)}`;
    const fileUrl = `./uploadedFiles/${newFileName}`;
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

export async function uploadFileToFirebase(fileUrl: string, Firebase, apartmentComplexUuid: string, fileName: string) {
    const bucket = Firebase.storage().bucket();

    const uploadedFileData = await bucket.upload(fileUrl, {
        destination: `${apartmentComplexUuid}/${fileName}`,
        gzip: true,
        metadata: {
            cacheControl: 'public, max-age=31536000'
        }
    });
    const fileData = uploadedFileData[0];
    const config = {action: 'read', expires: '01-01-2025'};
    // @ts-ignore
    const [downloadUrl] = await fileData.getSignedUrl(config);
    return downloadUrl;
}

export async function deleteImageFromFirebase(imageUuid, Firebase) {
    const bucket = Firebase.storage().bucket();
    return await bucket.deleteFiles({
        prefix: imageUuid
    });
}


export async function appendSingleImage(args, Firebase) {
    const {file: filePromise, uuid: apartmentComplexId, mode} = args;
    const [fileUrl, imageUuid, newFileName] = await saveImage(await filePromise);
    try {
        const downloadUrl = await uploadFileToFirebase(fileUrl, Firebase, apartmentComplexId, newFileName);
        await addSingleImage({
            mode,
            downloadUrl,
            imageUuid,
            apartmentComplexId
        });
        return {
            downloadUrl
        };
    } finally {
        fs.unlinkSync(fileUrl);
    }
}

export async function appendVRImage(args, Firebase) {
    const {file: filePromise, uuid: apartmentComplexId, mode} = args;
    const [fileUrl, imageUuid, newFileName] = await saveImage(await filePromise);
    const [previewImageUrl, uuid, newPreviewName] = await compressImage(fileUrl);
    try {
        const downloadUrl = await uploadFileToFirebase(fileUrl, Firebase, apartmentComplexId, newFileName);
        const downloadPreviewUrl = await uploadFileToFirebase(previewImageUrl, Firebase, apartmentComplexId, newPreviewName);
        await addPreviewImage({
            mode,
            downloadUrl,
            imageUuid,
            apartmentComplexId,
            previewImageUrl: downloadPreviewUrl,
            name: args.name
        });
        return {
            downloadUrl,
            downloadPreviewUrl
        };
    } finally {
        fs.unlinkSync(fileUrl);
        fs.unlinkSync(previewImageUrl);
    }
}

export async function appendImage(args, Firebase) {
    const {mode} = args;
    if ([ImageType.CHESS_GRID, ImageType.MOBILE, ImageType.SITE].includes(mode)) {
        return await appendSingleImage(args, Firebase);
    } else if ([ImageType.HALF_VR, ImageType.VR].includes(mode)) {
        return await appendVRImage(args, Firebase);
    }
}
