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
    class: {type: KeyDisplayNameSchema},
    levels: {type: Schema.Types.Number},
    price: {type: Schema.Types.Number, required: true},
    beginDate: {type: Schema.Types.String},
    address: {type: Schema.Types.String},
    parking: {type: Schema.Types.Boolean},
    endDate: {type: Schema.Types.String},
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
