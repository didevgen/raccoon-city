import * as mongoose from 'mongoose';
import { Schema, Document } from 'mongoose';
import {KeyDisplayName} from '../../types/shared';
import {KeyDisplayNameSchema} from './shared';

export interface ApartmentComplex extends Document {
    type: KeyDisplayName;
    name: String;
    city: KeyDisplayName;
    district: KeyDisplayName;
    class: KeyDisplayName;
    levels: number;
    sections: number;
    price: number;
    beginDate: String
    endDate: String
}

const ApartmentComplexSchema: Schema = new Schema({
    type: { type: KeyDisplayNameSchema, required: true },
    name: { type: Schema.Types.String, required: true },
    city: { type: KeyDisplayNameSchema, required: true },
    district: { type: KeyDisplayNameSchema, required: true },
    class: { type: KeyDisplayNameSchema, required: true },
    levels: { type: Schema.Types.Number, required: true },
    sections: { type: Schema.Types.Number, required: true },
    price: { type: Schema.Types.Number, required: true },
    beginDate: { type: Schema.Types.String, required: true },
    endDate: { type: Schema.Types.String, required: true }
});

export default mongoose.model<ApartmentComplex>('ApartmentComplex', ApartmentComplexSchema);
