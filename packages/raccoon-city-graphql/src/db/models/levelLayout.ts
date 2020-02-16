import * as mongoose from 'mongoose';
import {Document, Schema} from 'mongoose';
import {SinglePreviewImage} from '../../types/shared';
import {House} from './house';
import {Level} from './level';
import {SinglePreviewImageSchema} from './shared';

export interface LevelLayout extends Document {
    house: House;
    name: string;
    image: SinglePreviewImage;
    levels: Level[];
}

const LevelLayoutSchema: Schema = new Schema(
    {
        name: Schema.Types.String,
        image: SinglePreviewImageSchema,
        house: {
            type: Schema.Types.ObjectId,
            ref: 'House'
        },
        levels: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Level',
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

export const LevelLayoutModel = mongoose.model<LevelLayout>('LevelLayout', LevelLayoutSchema);
