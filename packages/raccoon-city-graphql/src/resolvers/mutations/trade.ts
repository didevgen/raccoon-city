import {Context} from '../../utils';
import {Trade, TradeModel} from '../../db/models/trade';
import {ContactModel} from '../../db/models/contact';

export const tradeMutation = {
    async createTrade(parent, args, ctx: Context): Promise<Trade> {
        const {developerUuid, trade} = args;
        let tradeNumber = 1;
        const maxNumberTrade = await TradeModel.findOne({})
            .sort('-tradeNumber')
            .exec();
        if (maxNumberTrade) {
            tradeNumber = maxNumberTrade.tradeNumber + 1;
        }

        let contact;
        if (trade.existingContact) {
            contact = trade.existingContact;
        } else if (trade.newContact) {
            const contacts = await ContactModel.find({
                isDeleted: false,
                phones: {
                    $elemMatch: {$in: trade.newContact.phones}
                }
            }).exec();

            if (contacts.length > 0) {
                const secondaryMatch = contacts.find((c) => {
                    return c?.name === trade.newContact?.name || c?.email === trade.newContact?.email;
                });
                if (secondaryMatch) {
                    contact = secondaryMatch.id;
                } else {
                    contact = contacts[0].id;
                }
            } else {
                const newContact = await ContactModel.create({
                    ...trade.newContact,
                    responsible: trade.responsible,
                    developer: developerUuid
                });
                contact = newContact.id;
            }
        }
        return await TradeModel.create({
            ...trade,
            tradeNumber,
            contact,
            developer: developerUuid
        });
    },
    async updateTrade(parent, args, ctx: Context): Promise<Trade> {
        const {uuid, trade} = args;

        const existingTrade = await TradeModel.findById(uuid).exec();
        let contact;
        if (trade.existingContact) {
            contact = trade.existingContact;
        } else if (trade.newContact) {
            const contacts = await ContactModel.find({
                isDeleted: false,
                phones: {
                    $elemMatch: {$in: trade.newContact.phones}
                }
            }).exec();

            if (contacts.length > 0) {
                const secondaryMatch = contacts.find((c) => {
                    return c?.name === trade.newContact?.name || c?.email === trade.newContact?.email;
                });
                if (secondaryMatch) {
                    contact = secondaryMatch.id;
                } else {
                    contact = contacts[0].id;
                }
            } else {
                const newContact = await ContactModel.create({
                    ...trade.newContact,
                    responsible: trade.responsible,
                    developer: existingTrade.developer
                });
                contact = newContact.id;
            }
        }

        trade.contact = contact;

        return await TradeModel.findOneAndUpdate(
            {
                _id: uuid,
                isDeleted: false
            },
            {
                $set: {
                    ...trade
                }
            }
        ).exec();
    },
    async deleteTrade(parent, {uuid}, ctx: Context) {
        await TradeModel.findOneAndUpdate(
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
