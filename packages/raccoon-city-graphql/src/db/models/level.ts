import * as mongoose from 'mongoose';
import {Document, Schema} from 'mongoose';
import {Flat} from './flat';
import {Section} from './section';

export interface Level extends Document {
    levelNumber: number;
    flats: Flat[];
    section: Section;
}

const LevelSchema: Schema = new Schema(
    {
        levelNumber: {type: Schema.Types.Number},
        section: {
            type: Schema.Types.ObjectId,
            ref: 'Section'
        }
    },
    {
        toJSON: {virtuals: true},
        toObject: {virtuals: true}
    }
);

LevelSchema.virtual('flats', {
    ref: 'Flat',
    localField: '_id',
    foreignField: 'level'
});

export const LevelModel = mongoose.model<Level>('Level', LevelSchema);
