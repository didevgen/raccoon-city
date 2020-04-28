import * as mongoose from 'mongoose';
import {Document, Schema} from 'mongoose';
import {KeyDisplayName} from '../../types/shared';
import {Flat} from './flat';
import {ApartmentComplexImages, imagesSchema, KeyDisplayNameSchema} from './shared';
import {Section} from './section';

export interface House extends Document {
    name: string;
    class: KeyDisplayName;
    levels: number;
    price: number;
    squarePrice: number;
    beginDate: string;
    endDate: string;
    apartmentComplex: string;
    flats: Flat[];
    sections: Section[];
    images: ApartmentComplexImages;
}

const HouseSchema: Schema = new Schema({
    name: {type: Schema.Types.String, required: true},
    class: {type: KeyDisplayNameSchema},
    levels: {type: Schema.Types.Number},
    price: {type: Schema.Types.Number, required: true},
    beginDate: {type: Schema.Types.String},
    squarePrice: {type: Schema.Types.Number},
    address: {type: Schema.Types.String},
    parking: {type: Schema.Types.Boolean},
    endDate: {type: Schema.Types.String},
    isDeleted: {type: Schema.Types.Boolean, default: false},
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

HouseSchema.virtual('sections', {
    ref: 'Section',
    localField: '_id',
    foreignField: 'house'
});

HouseSchema.virtual('flats', {
    ref: 'Flat',
    localField: '_id',
    foreignField: 'house'
});

export default mongoose.model<House>('House', HouseSchema);
