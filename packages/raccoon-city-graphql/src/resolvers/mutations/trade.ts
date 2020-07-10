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
            const newContact = await ContactModel.create({
                ...trade.newContact,
                developer: developerUuid
            });
            contact = newContact.id;
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
            const newContact = await ContactModel.create({
                ...trade.newContact,
                developer: existingTrade.developer
            });
            contact = newContact.id;
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
