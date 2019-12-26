import * as mongoose from 'mongoose';
import {Document, Schema} from 'mongoose';
import {FlatStatus} from '../../types/flat/flat';
import {House} from './house';

export interface Flat extends Document {
    flatNumber: number;
    price: number;
    level: number;
    entrance: string;
    area: number;
    status: FlatStatus;
    roomAmount: number;
    house: string;
    isFake?: boolean;
}

const FlatSchema: Schema = new Schema({
    flatNumber: {type: Schema.Types.Number},
    price: {type: Schema.Types.Number},
    level: {type: Schema.Types.Number},
    entrance: {type: Schema.Types.String},
    area: {type: Schema.Types.Number},
    status: {type: Schema.Types.String},
    roomAmount: {type: Schema.Types.Number},
    house: {
        type: Schema.Types.ObjectId,
        ref: 'House'
    },
    isFake: {type: Schema.Types.Boolean}
});

export const FlatModel = mongoose.model<Flat>('Flat', FlatSchema);
