import * as mongoose from 'mongoose';
import {Document, Schema} from 'mongoose';
import {KeyDisplayName, SingleImage} from '../../types/shared';
import {ApartmentComplex} from './apartmentComplex';
import {KeyDisplayNameSchema, SingleImageSchema} from './shared';
import {Flat} from './flat';

export interface Developer extends Document {
    name: string;
    address: string;
    emails: string[];
    receptionNumbers: string[];
    salesNumbers: string[];
    city: KeyDisplayName;
    apartmentComplexes: ApartmentComplex[];
    logo: SingleImage;
}

const DeveloperSchema: Schema = new Schema({
    name: {type: Schema.Types.String, required: true},
    city: {type: Schema.Types.String, required: true},
    address: {type: Schema.Types.String, required: true},
    emails: [{type: Schema.Types.String}],
    receptionNumbers: [{type: Schema.Types.String}],
    salesNumbers: [{type: Schema.Types.String}],
    apartmentComplexes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'ApartmentComplex',
            default: () => {
                return [];
            }
        }
    ],
    logo: {type: SingleImageSchema}
});
export const DeveloperModel = mongoose.model<Developer>('Developer', DeveloperSchema);
