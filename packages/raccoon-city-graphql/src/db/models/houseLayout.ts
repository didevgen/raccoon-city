import * as mongoose from 'mongoose';
import {Document, Schema} from 'mongoose';
import {SinglePreviewImage} from '../../types/shared';
import {Flat} from './flat';
import {House} from './house';
import {SimpleImages, simpleImageSchema, SinglePreviewImageSchema} from './shared';

export interface HouseLayout extends Document {
    house: House;
    name: string;
    image: SinglePreviewImage;
    flats: Flat[];
    images: SimpleImages;
}

const HouseLayoutSchema: Schema = new Schema(
    {
        name: Schema.Types.String,
        image: SinglePreviewImageSchema,
        house: {
            type: Schema.Types.ObjectId,
            ref: 'House'
        },
        isDeleted: {type: Schema.Types.Boolean, default: false},
        images: {
            type: simpleImageSchema,
            default: () => {
                return {};
            }
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
HouseLayoutSchema.add({published: HouseLayoutSchema});
export const HouseLayoutModel = mongoose.model<HouseLayout>('HouseLayout', HouseLayoutSchema);
