import * as mongoose from 'mongoose';
import {Document, Schema} from 'mongoose';
import {User} from './user';

export interface Contact extends Document {
    name: string;
    email: string;
    position: string;
    clientStatus: string;
    phone: string[];
    responsible: User;
    isDeleted: boolean;
    clientSources: string;
}

const ContactSchema: Schema = new Schema(
    {
        name: {type: Schema.Types.String, required: true},
        email: {type: Schema.Types.String},
        clientSources: {type: Schema.Types.String},
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

ContactSchema.virtual('trades', {
    ref: 'Trade',
    localField: '_id',
    foreignField: 'contact'
});

export const ContactModel = mongoose.model<Contact>('Contact', ContactSchema);
