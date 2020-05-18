import * as mongoose from 'mongoose';
import {Document, Schema} from 'mongoose';
import {Flat} from './flat';
import {Section} from './section';
import {LevelLayout} from './levelLayout';

export interface Level extends Document {
    levelNumber: number;
    flats: Flat[];
    layouts: LevelLayout[];
    section: Section;
}

const LevelSchema: Schema = new Schema(
    {
        levelNumber: {type: Schema.Types.Number},
        section: {
            type: Schema.Types.ObjectId,
            ref: 'Section'
        },
        isDeleted: {type: Schema.Types.Boolean, default: false}
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

LevelSchema.virtual('layouts', {
    ref: 'LevelLayout',
    localField: '_id',
    foreignField: 'levels'
});

LevelSchema.add({published: LevelSchema});

export const LevelModel = mongoose.model<Level>('Level', LevelSchema);
