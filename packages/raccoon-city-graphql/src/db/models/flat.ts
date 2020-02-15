import * as mongoose from 'mongoose';
import {Document, Schema} from 'mongoose';
import {FlatStatus} from '../../types/flat/flat';
import {House} from './house';
import {Level} from './level';
import {Section} from './section';

export interface Flat extends Document {
    flatNumber: number;
    price: number;
    level: Level;
    section: Section;
    area: number;
    status: FlatStatus;
    roomAmount: number;
    house: House;
    layout: string;
}

const FlatSchema: Schema = new Schema(
    {
        flatNumber: {type: Schema.Types.Number},
        price: {type: Schema.Types.Number},
        level: {
            type: Schema.Types.ObjectId,
            ref: 'Level'
        },
        section: {
            type: Schema.Types.ObjectId,
            ref: 'Section'
        },
        area: {type: Schema.Types.Number},
        status: {type: Schema.Types.String},
        roomAmount: {type: Schema.Types.Number},
        house: {
            type: Schema.Types.ObjectId,
            ref: 'House'
        },
        layout: {
            type: Schema.Types.ObjectId,
            ref: 'HouseLayout'
        }
    },
    {
        toJSON: {virtuals: true},
        toObject: {virtuals: true}
    }
);

export const FlatModel = mongoose.model<Flat>('Flat', FlatSchema);
