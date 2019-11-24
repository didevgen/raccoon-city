import {Schema} from 'mongoose';

export const KeyDisplayNameSchema = new Schema({
    key: {type: Schema.Types.String, required: true},
    displayName: {type: Schema.Types.String, required: true}
});

export const SingleImageSchema = new Schema({
    uuid: {type: Schema.Types.String, required: true},
    downloadUrl: {type: Schema.Types.String, required: true}
});

export const NamedImageSchema = new Schema({
    uuid: {type: Schema.Types.String, required: true},
    name: {type: Schema.Types.String, required: true},
    downloadUrl: {type: Schema.Types.String, required: true}
});
