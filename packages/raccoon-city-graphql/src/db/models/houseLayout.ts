import * as mongoose from 'mongoose';
import {Document, Schema} from 'mongoose';
import {Flat} from './flat';
import {House} from './house';
import {SinglePreviewImageSchema} from './shared';
import {SinglePreviewImage} from '../../types/shared';

export interface HouseLayout extends Document {
    house: House;
    name: string;
    image: SinglePreviewImage;
    flats: Flat[];
}

const HouseLayoutSchema: Schema = new Schema(
    {
        name: Schema.Types.String,
        image: SinglePreviewImageSchema,
        house: {
            type: Schema.Types.ObjectId,
            ref: 'House'
        },
        flats: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Flat',
                default: () => {
                    return [];
                }
            }
        ]
    },
    {
        toJSON: {virtuals: true},
        toObject: {virtuals: true}
    }
);

export const HouseLayoutModel = mongoose.model<HouseLayout>('HouseLayout', HouseLayoutSchema);
