import * as mongoose from 'mongoose';
import {Document, Schema} from 'mongoose';
import {SinglePreviewImage} from '../../types/shared';
import {House} from './house';
import {Level} from './level';
import {LevelFlatLayout} from './levelFlatLayout';
import {SinglePreviewImageSchema} from './shared';

export interface LevelLayout extends Document {
    house: House;
    name: string;
    image: SinglePreviewImage;
    levels: Level[];
    flatLayouts: LevelFlatLayout[];
}

const LevelLayoutSchema: Schema = new Schema(
    {
        name: Schema.Types.String,
        image: SinglePreviewImageSchema,
        house: {
            type: Schema.Types.ObjectId,
            ref: 'House'
        },
        isDeleted: {type: Schema.Types.Boolean, default: false},
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

LevelLayoutSchema.virtual('flatLayouts', {
    ref: 'LevelFlatLayout',
    localField: '_id',
    foreignField: 'levelLayout'
});

export const LevelLayoutModel = mongoose.model<LevelLayout>('LevelLayout', LevelLayoutSchema);
