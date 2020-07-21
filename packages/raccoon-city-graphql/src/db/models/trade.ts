import * as mongoose from 'mongoose';
import {Document, Schema} from 'mongoose';
import {User} from './user';
import {Contact} from './contact';
import {Developer} from './developer';

export interface Trade extends Document {
    tradeNumber: number;
    state: string;
    responsible: User;
    budget: number;
    tradeSource: string;
    leadStatus: string;
    clientInterests: string[];
    link: string;
    objectType: string;
    flat: {
        flatId: string;
        flatNumber: number;
        section: string;
        level: string;
        apartmentComplexId: string;
        apartmentComplex: string;
        house: string;
        houseId: string;
    };
    contact: Contact;
    visitDate: string;
    nextVisitDate: string;
    paymentType: string;
    propertyType: string;
    paymentProvider: string;
    price: number;
    developer: Developer;
    isDeleted: boolean;
}

const TradeFlatSchema = new Schema({
    flatId: {type: Schema.Types.String, required: true},
    flatNumber: {type: Schema.Types.String, required: true},
    section: {type: Schema.Types.String, required: true},
    level: {type: Schema.Types.String, required: true},
    apartmentComplexId: {type: Schema.Types.String, required: true},
    apartmentComplex: {type: Schema.Types.String, required: true},
    house: {type: Schema.Types.String, required: true},
    houseId: {type: Schema.Types.String, required: true}
});

const TradeSchema: Schema = new Schema(
    {
        tradeNumber: {type: Schema.Types.Number, required: true},
        state: {type: Schema.Types.String, required: true},
        budget: {type: Schema.Types.Number},
        tradeSource: {type: Schema.Types.String},
        leadStatus: {type: Schema.Types.String},
        clientInterests: [{type: Schema.Types.String}],
        link: {type: Schema.Types.String},
        visitDate: {type: Schema.Types.String},
        nextVisitDate: {type: Schema.Types.String},
        paymentType: {type: Schema.Types.String},
        propertyType: {type: Schema.Types.String},
        paymentProvider: {type: Schema.Types.String},
        price: {type: Schema.Types.Number},
        responsible: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        flat: {type: TradeFlatSchema, required: true},
        contact: {
            type: Schema.Types.ObjectId,
            ref: 'Contact'
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

export const TradeModel = mongoose.model<Trade>('Trade', TradeSchema);
