import * as mongoose from 'mongoose';
import {Document, Schema} from 'mongoose';
import {ApartmentComplex} from './apartmentComplex';

export interface FileHistory extends Document {
    name: string;
    timestamp: Date;
    downloadUrl: string;
    apartmentComplex: ApartmentComplex;
    isDeleted: boolean;
}

const FileHistorySchema: Schema = new Schema({
    name: {type: Schema.Types.String, required: true},
    timestamp: {type: Schema.Types.Date, required: true},
    downloadUrl: {type: Schema.Types.String, required: true},
    apartmentComplex: {
        type: Schema.Types.ObjectId,
        ref: 'ApartmentComplex'
    },
    isDeleted: {type: Schema.Types.Boolean, default: false}
});

export const FileHistoryModel = mongoose.model<FileHistory>('FileHistory', FileHistorySchema);
