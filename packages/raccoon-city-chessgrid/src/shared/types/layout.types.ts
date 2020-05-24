import {Flat} from './flat.types';
import {Level} from './level.types';
import {NamedImage, PreviewImage} from './apartmentComplex.types';

export interface SinglePreviewImage {
    uuid: string;
    downloadUrl: string;
    previewImageUrl: string;
}

export interface SimpleImages {
    PHOTO?: NamedImage[];
    VR?: PreviewImage[];
    HALF_VR?: PreviewImage[];
}

export interface HouseLayout {
    id: string;
    name: string;
    image: SinglePreviewImage;
    flats: Flat[];
    images: SimpleImages;
}

export interface LevelLayout {
    id: string;
    name: string;
    image: SinglePreviewImage;
    levels: Level[];
}
