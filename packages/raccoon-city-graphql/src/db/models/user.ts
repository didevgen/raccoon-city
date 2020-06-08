import * as mongoose from 'mongoose';
import {Document, Schema} from 'mongoose';
import {UserRoleSchema} from './shared';

export interface User extends Document {
    name: string;
    email: string;
    password: string;
    role: {
        key: string;
        displayName: string;
        features: string[];
    }
    isDeleted: boolean;
}

const UserSchema: Schema = new Schema({
    name: {type: Schema.Types.String, required: true},
    email: {type: Schema.Types.String, required: true},
    password: {type: Schema.Types.String, required: true},
    role: {type: UserRoleSchema, required: true},
    isDeleted: {type: Schema.Types.Boolean}
});

export const UserModel = mongoose.model<User>('User', UserSchema);
