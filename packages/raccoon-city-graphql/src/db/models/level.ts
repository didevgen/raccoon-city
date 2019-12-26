import * as mongoose from 'mongoose';
import {Document, Schema} from 'mongoose';
import {Flat} from './flat';

export interface Level extends Document {
    levelNumber: number;
    flats: Flat[];
}

const LevelSchema: Schema = new Schema({
    levelNumber: {type: Schema.Types.Number},
    flats: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Flat',
            default: () => {
                return [];
            }
        }
    ]
});

export const LevelModel = mongoose.model<Level>('Flat', LevelSchema);
