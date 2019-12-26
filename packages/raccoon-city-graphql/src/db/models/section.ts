import * as mongoose from 'mongoose';
import {Document, Schema} from 'mongoose';
import {Level} from './level';

export interface Section extends Document {
    entrance: string;
    levels: Level[];
}

const SectionSchema: Schema = new Schema({
    entrance: {type: Schema.Types.String},
    levels: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Level',
            default: () => {
                return [];
            }
        }
    ]
});

export const SectionModel = mongoose.model<Level>('Section', SectionSchema);
