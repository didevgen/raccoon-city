import {ContactModel} from '../../db/models/contact';
import mongoose from 'mongoose';

export const contactsQuery = {
    getAllContacts: async (_, {developerUuid}) => {
        return await ContactModel.find({
            developer: mongoose.Types.ObjectId(developerUuid),
            isDeleted: false
        }).exec();
    },
    getContact: async (parent, {uuid}) => {
        return await ContactModel.findOne({
            _id: uuid,
            isDeleted: false
        })
            .populate({
                path: 'responsible'
            })
            .exec();
    }
};
