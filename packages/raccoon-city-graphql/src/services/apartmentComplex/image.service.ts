import ApartmentComplexModel, {ApartmentComplex} from '../../db/models/apartmentComplex';
import {SingleImage} from 'shared';

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
async function singleImage(params: AppendImageParams) {
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

function multipleImages(params: AppendImageParams) {}

export async function appendImage(params: AppendImageParams) {
    await singleImage(params);
}
