import * as mongoose from 'mongoose';
import {Schema, Document} from 'mongoose';
import {KeyDisplayName, NamedImage, PreviewImage, SingleImage} from '../../types/shared';
import {KeyDisplayNameSchema, NamedImageSchema, SingleImageSchema, PreviewImageSchema} from './shared';

export interface ApartmentComplexImages {
    CHESS_GRID?: SingleImage;
    SITE?: SingleImage;
    MOBILE?: SingleImage;
    PHOTO?: NamedImage[];
    VR?: PreviewImage[];
    HALF_VR?: PreviewImage[];
}

export interface ApartmentComplex extends Document {
    type: KeyDisplayName;
    name: String;
    city: KeyDisplayName;
    district: KeyDisplayName;
    class: KeyDisplayName;
    levels: number;
    sections: number;
    price: number;
    beginDate: String;
    endDate: String;
    images: ApartmentComplexImages;
}

const imagesSchema: Schema = new Schema({
    CHESS_GRID: {type: SingleImageSchema},
    SITE: {type: SingleImageSchema},
    MOBILE: {type: SingleImageSchema},
    PHOTO: {type: [NamedImageSchema]},
    VR: {type: [PreviewImageSchema]},
    HALF_VR: {type: [PreviewImageSchema]}
});
const ApartmentComplexSchema: Schema = new Schema({
    type: {type: KeyDisplayNameSchema, required: true},
    name: {type: Schema.Types.String, required: true},
    city: {type: KeyDisplayNameSchema, required: true},
    district: {type: KeyDisplayNameSchema, required: true},
    class: {type: KeyDisplayNameSchema, required: true},
    levels: {type: Schema.Types.Number, required: true},
    sections: {type: Schema.Types.Number, required: true},
    price: {type: Schema.Types.Number, required: true},
    beginDate: {type: Schema.Types.String, required: true},
    endDate: {type: Schema.Types.String, required: true},
    images: {
        type: imagesSchema,
        default: () => {
            return {};
        }
    }
});

export default mongoose.model<ApartmentComplex>('ApartmentComplex', ApartmentComplexSchema);
