import * as mongoose from 'mongoose';
import {Document, Schema} from 'mongoose';
import {SinglePreviewImage} from '../../types/shared';
import {SinglePreviewImageSchema} from './shared';
import {ApartmentComplex} from './apartmentComplex';
import {ViewBoxSchema} from './levelFlatLayout';
import {House} from './house';

export interface ApartmentComplexLayout extends Document {
    apartmentComplex: ApartmentComplex;
    name: string;
    image: SinglePreviewImage;
    layouts: {
        house: House;
        viewBox: any;
        path: string[];
    }[]
}

const ApartmentComplexSvgSchema: Schema = new Schema(
    {
        path: [
            {
                type: Schema.Types.String
            }
        ],
        viewBox: {type: ViewBoxSchema},
        house: {
            type: Schema.Types.ObjectId,
            ref: 'PublishedHouse'
        },
    }, {
        toJSON: {virtuals: true},
        toObject: {virtuals: true}
    }
)

const ApartmentComplexLayoutSchema: Schema = new Schema(
    {
        name: Schema.Types.String,
        image: SinglePreviewImageSchema,
        apartmentComplex: {
            type: Schema.Types.ObjectId,
            ref: 'ApartmentComplex'
        },
        isDeleted: {type: Schema.Types.Boolean, default: false},
        layouts: [ApartmentComplexSvgSchema]
    },
    {
        toJSON: {virtuals: true},
        toObject: {virtuals: true}
    }
);
export const ApartmentComplexLayoutModel = mongoose.model<ApartmentComplexLayout>('ApartmentComplexLayout', ApartmentComplexLayoutSchema);
