import * as mongoose from 'mongoose';
import {Document, Schema} from 'mongoose';
import {House} from './house';
import {Level} from './level';

export interface Section extends Document {
    sectionName: string;
    levels: Level[];
    house: string;
}

const SectionSchema: Schema = new Schema(
    {
        sectionName: {type: Schema.Types.String},
        house: {
            type: Schema.Types.ObjectId,
            ref: 'House'
        }
    },
    {
        toJSON: {virtuals: true},
        toObject: {virtuals: true}
    }
);

SectionSchema.virtual('levels', {
    ref: 'Level',
    localField: '_id',
    foreignField: 'section'
});

export const SectionModel = mongoose.model<Section>('Section', SectionSchema);
