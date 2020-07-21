import * as mongoose from 'mongoose';
import {Document, Schema} from 'mongoose';
import {User} from './user';

export interface Contact extends Document {
    name: string;
    email: string;
    position: string;
    clientStatus: string;
    phone: string;
    responsible: User;
    isDeleted: boolean;
}

const ContactSchema: Schema = new Schema(
    {
        name: {type: Schema.Types.String, required: true},
        email: {type: Schema.Types.String},
        phones: [{type: Schema.Types.String, required: true}],
        position: {type: Schema.Types.String},
        clientStatus: {type: Schema.Types.String},
        responsible: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        developer: {
            type: Schema.Types.ObjectId,
            ref: 'Developer'
        },
        isDeleted: {type: Schema.Types.Boolean, default: false}
    },
    {
        toJSON: {virtuals: true},
        toObject: {virtuals: true}
    }
);

export const ContactModel = mongoose.model<Contact>('Contact', ContactSchema);
