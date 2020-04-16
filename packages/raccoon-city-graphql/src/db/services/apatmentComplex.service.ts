import {ImageType} from '../../services/image/imageService';

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

export interface RemoveImageParams {
    apartmentComplexId: string;
    imageUuid: string;
    mode: ImageType;
}
