import mongoose from 'mongoose';
import {TradeModel} from '../../db/models/trade';

export const tradesQuery = {
    getAllTrades: async (_, {developerUuid}) => {
        return await TradeModel.find({
            developer: mongoose.Types.ObjectId(developerUuid),
            isDeleted: false
        })
            .populate({
                path: 'responsible'
            })
            .populate({
                path: 'contact'
            })
            .exec();
    },
    getTrade: async (parent, {uuid}) => {
        return await TradeModel.findOne({
            _id: uuid,
            isDeleted: false
        })
            .populate({
                path: 'responsible'
            })
            .populate({
                path: 'contact'
            })
            .exec();
    },
    getTradesForAppropriateContact: async (parent, {contactId}) => {
        return await TradeModel.find({contact: contactId});
    }
};
