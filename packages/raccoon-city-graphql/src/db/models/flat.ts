import * as mongoose from 'mongoose';
import {Document, Schema} from 'mongoose';
import {FlatStatus} from '../../types/flat/flat';
import {House} from './house';
import {HouseLayout} from './houseLayout';
import {Level} from './level';
import {Section} from './section';

export interface Flat extends Document {
    flatNumber: string;
    price: number;
    level: Level;
    section: Section;
    area: number;
    status: FlatStatus;
    roomAmount: string;
    squarePrice: number;
    squarePriceSale: number;
    house: House;
    layout: HouseLayout;
    levelAmount: number;
    sale: number;
}

const FlatSchema: Schema = new Schema(
    {
        flatNumber: {type: Schema.Types.String},
        price: {type: Schema.Types.Number},
        sale: {type: Schema.Types.Number},
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
        roomAmount: {type: Schema.Types.String},
        squarePrice: {type: Schema.Types.Number},
        squarePriceSale: {type: Schema.Types.Number},
        isDeleted: {type: Schema.Types.Boolean, default: false},
        house: {
            type: Schema.Types.ObjectId,
            ref: 'House'
        },
        layout: {
            type: Schema.Types.ObjectId,
            ref: 'HouseLayout'
        },
        levelAmount: {type: Schema.Types.Number, default: 1}
    },
    {
        toJSON: {virtuals: true},
        toObject: {virtuals: true}
    }
);

export const FlatModel = mongoose.model<Flat>('Flat', FlatSchema);
