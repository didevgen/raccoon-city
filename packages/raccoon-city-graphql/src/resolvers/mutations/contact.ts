import {Context} from '../../utils';
import {Contact, ContactModel} from '../../db/models/contact';

export const contactsMutation = {
    async createContact(parent, args, ctx: Context): Promise<Contact> {
        const {developerUuid, contact} = args;
        return await ContactModel.create({
            ...contact,
            developer: developerUuid
        });
    },
    async updateContact(parent, args, ctx: Context): Promise<Contact> {
        const {uuid, contact} = args;
        return await ContactModel.findOneAndUpdate(
            {
                _id: uuid,
                isDeleted: false
            },
            {
                $set: {
                    ...contact
                }
            }
        ).exec();
    },
    async deleteContact(parent, {uuid}, ctx: Context) {
        await ContactModel.findOneAndUpdate(
            {
                _id: uuid
            },
            {
                $set: {
                    isDeleted: true
                }
            }
        ).exec();
         return true;
    }
};
