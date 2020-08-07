import { Context } from '../../utils';
import { Trade, TradeModel } from '../../db/models/trade';
import { ContactModel } from '../../db/models/contact';

export const tradeMutation = {
    async createTrade(parent, args, ctx: Context): Promise<Trade> {
        const { developerUuid, trade } = args;
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
                    $elemMatch: { $in: trade.newContact.phones }
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
            developer: developerUuid,
        });
    },
    async updateTrade(parent, args, ctx: Context): Promise<Trade> {
        const { uuid, trade } = args;

        const existingTrade = await TradeModel.findById(uuid).exec();
        let contact;
        if (trade.existingContact) {
            contact = trade.existingContact;
        } else if (trade.newContact) {
            const contacts = await ContactModel.find({
                isDeleted: false,
                phones: {
                    $elemMatch: { $in: trade.newContact.phones }
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
    async deleteTrade(parent, { uuid }, ctx: Context) {
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
    },
    async requestFromPublicForm(parent, args, ctx: Context) {
        const { flat, userInfo: { name, phone, email } } = args;
        let tradeNumber = 1;

        const maxNumberTrade = await TradeModel.findOne({})
            .sort('-tradeNumber')
            .exec();
        if (maxNumberTrade) {
            tradeNumber = maxNumberTrade.tradeNumber + 1;
        }

        const contacts = await ContactModel.find({
            isDeleted: false,
            phones: {
                $elemMatch: { $in: [phone] }
            }
        }).exec();

        const length = contacts.length;

        const contactInfo = {
            name,
            phones: [phone],
            email: email,
            clientStatus: "potential",
            responsible: "-",
            position: "default",
            clientSources: "site",
        }

        const tradeInfo = {
            state: "initial_contact",
            leadStatus: "delayed",
            clientInterests: ["single"],
            link: "default.com",
            visitDate: "24.5.2020",
            nextVisitDate: "25.5.2020",
            paymentType: "full",
            tradeSource: "site",
            propertyType: "flat",
            paymentProvider: "financial_company",
            responsible: "-",
            flat: flat,
            existingContact: length ? contacts[0].id : "",
            newContact: contactInfo
        }

        return await TradeModel.create({
            ...tradeInfo,
            tradeNumber,
            contact: contactInfo,
            developer: "-",
            isNewTrade: true,
        });
    }
};
