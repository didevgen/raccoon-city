import * as mongoose from 'mongoose';
import {Document, Schema} from 'mongoose';
import {KeyDisplayName} from '../../types/shared';
import {ApartmentComplexImages, imagesSchema, KeyDisplayNameSchema} from './shared';

export interface House extends Document {
    name: string;
    class: KeyDisplayName;
    levels: number;
    price: number;
    beginDate: string;
    endDate: string;
    apartmentComplex: string;
    images: ApartmentComplexImages;
}

const HouseSchema: Schema = new Schema({
    name: {type: Schema.Types.String, required: true},
    class: {type: KeyDisplayNameSchema, required: true},
    levels: {type: Schema.Types.Number, required: true},
    price: {type: Schema.Types.Number, required: true},
    beginDate: {type: Schema.Types.String, required: true},
    endDate: {type: Schema.Types.String, required: true},
    apartmentComplex: {
        type: Schema.Types.ObjectId,
        ref: 'ApartmentComplex'
    },
    images: {
        type: imagesSchema,
        default: () => {
            return {};
        }
    }
});

export default mongoose.model<House>('House', HouseSchema);
