import {Context} from '../../utils';
import {Contact, ContactModel} from '../../db/models/contact';
import {sendAmoGetFullRequest, sendAmoGetRequest} from '../../services/amo/amo.service';
import {mapContacts} from '../../services/amo/amoContacts.service';

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
    },
    async syncWithAmo(parent, {developerUuid}, {redis}) {
        const response = await sendAmoGetRequest(developerUuid, {path: '/api/v4/contacts', params: {
                limit: 250
            }}, redis);
        const {data} = response;
        const {_links, _embedded} = data;
        let contactArr: any[] = [..._embedded.contacts];
        let nextLink: any = _links.next;
        while (nextLink) {
            const pageData = await sendAmoGetFullRequest(developerUuid, {url: nextLink.href, params: {}}, redis);
            const {data} = pageData;
            const {_links, _embedded} = data;
            if (!_links) {
                break;
            }
            nextLink = _links?.next;
            contactArr = contactArr.concat(_embedded.contacts);
        }
        const mapped = await mapContacts(contactArr);
        return true;
    }
};
