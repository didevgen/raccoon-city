import * as mongoose from 'mongoose';
import {Document, Schema} from 'mongoose';
import {FlatStatus} from '../../types/flat/flat';
import {House} from './house';

export interface Flat extends Document {
    flatNumber: number;
    price: number;
    level: number;
    dormitory: number;
    area: number;
    status: FlatStatus;
    roomAmount: number;
    house: string;
}

const FlatSchema: Schema = new Schema({
    flatNumber: {type: Schema.Types.Number, required: true},
    price: {type: Schema.Types.Number},
    level: {type: Schema.Types.Number},
    dormitory: {type: Schema.Types.Number},
    area: {type: Schema.Types.Number},
    status: {type: Schema.Types.String},
    roomAmount: {type: Schema.Types.Number},
    house: {
        type: Schema.Types.ObjectId,
        ref: 'House'
    }
});

export const FlatModel = mongoose.model<Flat>('Flat', FlatSchema);
