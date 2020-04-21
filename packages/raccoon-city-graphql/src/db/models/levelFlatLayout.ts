import * as mongoose from 'mongoose';
import {Document, Schema} from 'mongoose';
import {HouseLayout} from './houseLayout';
import {LevelLayout} from './levelLayout';

export interface LevelFlatLayout extends Document {
    path: string[];
    levelLayout: LevelLayout;
    flatLayout: HouseLayout;
}

const ViewBoxSchema = new Schema({
    width: {type: Schema.Types.Number},
    height: {type: Schema.Types.Number}
});
const LevelFlatLayoutSchema: Schema = new Schema(
    {
        path: [
            {
                type: Schema.Types.String
            }
        ],
        viewBox: {type: ViewBoxSchema},
        levelLayout: {
            type: Schema.Types.ObjectId,
            ref: 'LevelLayout'
        },
        flatLayout: {
            type: Schema.Types.ObjectId,
            ref: 'HouseLayout'
        }
    },
    {
        toJSON: {virtuals: true},
        toObject: {virtuals: true}
    }
);

export const LevelFlatLayoutModel = mongoose.model<LevelFlatLayout>('LevelFlatLayout', LevelFlatLayoutSchema);
