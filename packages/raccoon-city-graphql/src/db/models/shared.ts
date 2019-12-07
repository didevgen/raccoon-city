import {Schema} from 'mongoose';
import {NamedImage, PreviewImage, SingleImage} from '../../types/shared';

export const KeyDisplayNameSchema = new Schema({
    key: {type: Schema.Types.String, required: true},
    displayName: {type: Schema.Types.String, required: true}
});

export const SingleImageSchema = new Schema({
    uuid: {type: Schema.Types.String, required: true},
    downloadUrl: {type: Schema.Types.String, required: true}
});

export const NamedImageSchema = new Schema({
    uuid: {type: Schema.Types.String, required: true},
    name: {type: Schema.Types.String, required: true},
    downloadUrl: {type: Schema.Types.String, required: true}
});

export const PreviewImageSchema = new Schema({
    uuid: {type: Schema.Types.String, required: true},
    name: {type: Schema.Types.String, required: true},
    downloadUrl: {type: Schema.Types.String, required: true},
    previewImageUrl: {type: Schema.Types.String, required: true}
});

export const imagesSchema: Schema = new Schema({
    CHESS_GRID: {type: SingleImageSchema},
    SITE: {type: SingleImageSchema},
    MOBILE: {type: SingleImageSchema},
    PHOTO: {type: [NamedImageSchema]},
    VR: {type: [PreviewImageSchema]},
    HALF_VR: {type: [PreviewImageSchema]}
});

export interface ApartmentComplexImages {
    CHESS_GRID?: SingleImage;
    SITE?: SingleImage;
    MOBILE?: SingleImage;
    PHOTO?: NamedImage[];
    VR?: PreviewImage[];
    HALF_VR?: PreviewImage[];
}
