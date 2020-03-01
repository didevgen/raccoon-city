import {Flat} from './flat.types';
import {Level} from './level.types';

export interface SinglePreviewImage {
    uuid: string;
    downloadUrl: string;
    previewImageUrl: string;
}

export interface HouseLayout {
    id: string;
    name: string;
    image: SinglePreviewImage;
    flats: Flat[];
}

export interface LevelLayout {
    id: string;
    name: string;
    image: SinglePreviewImage;
    levels: Level[];
}
