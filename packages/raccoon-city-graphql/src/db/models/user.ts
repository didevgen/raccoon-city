import * as mongoose from 'mongoose';
import {Document, Schema} from 'mongoose';

export interface User extends Document {
    name: string;
    email: string;
    password: string;
    features: [string];
    isDeleted: boolean;
}

const UserSchema: Schema = new Schema({
    name: {type: Schema.Types.String, required: true},
    email: {type: Schema.Types.String, required: true},
    password: {type: Schema.Types.String, required: true},
    features: [
        {
            type: Schema.Types.String,
            required: true,
            default: () => {
                return [];
            }
        }
    ],
    isDeleted: {type: Schema.Types.Boolean}
});

export const UserModel = mongoose.model<User>('User', UserSchema);
