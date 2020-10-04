import {Flat} from './flat.types';
import {Level} from './level.types';
import {NamedImage, PreviewImage} from './apartmentComplex.types';
import {ViewBox} from '@svgdotjs/svg.js';
import {House} from './house.types';

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

export interface ApartmentComplexLayout {
    id: string;
    name: string;
    image: SinglePreviewImage;
    images: SimpleImages;
    layouts: [
        {
            path: string[];
            viewBox: ViewBox;
            house: House;
        }
    ];
}

export interface LevelLayout {
    id: string;
    name: string;
    image: SinglePreviewImage;
    levels: Level[];
}
