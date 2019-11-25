import ApartmentComplexModel, {ApartmentComplex} from '../../db/models/apartmentComplex';

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
        images[params.mode] = {
            uuid: params.imageUuid,
            downloadUrl: params.downloadUrl
        };
        apartmentComplex.images = images;
        apartmentComplex.save();
    });
}

function multipleImages(params: AppendImageParams) {}

export async function appendImage(params: AppendImageParams) {
    await singleImage(params);
}
