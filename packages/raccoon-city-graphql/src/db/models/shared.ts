import {Schema} from "mongoose";

export const KeyDisplayNameSchema = new Schema({
    key: { type: Schema.Types.String, required: true },
    displayName: { type: Schema.Types.String, required: true }
});
