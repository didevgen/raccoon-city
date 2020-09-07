import {ContactModel} from '../../db/models/contact';
import mongoose from 'mongoose';
import {ClientSources, ClientStatuses} from '../../constants/tradeConstants';

function mapCustomFieldsToContact(amoContact) {
    const result: any = {};
    result.amoId = amoContact.id;
    result.name = amoContact.name || `${amoContact.first_name || ''} ${amoContact.last_name || ''}`;
    if (!amoContact.custom_fields_values) {
        return result;
    }
    const phone = amoContact.custom_fields_values.find((field) => {
        return field.field_code === 'PHONE';
    });

    const clientStatus = amoContact.custom_fields_values.find((field) => {
        return field.field_name === 'Статус клиента';
    });

    const clientSource = amoContact.custom_fields_values.find((field) => {
        return field.field_name === 'Источник клиента';
    });

    if (phone) {
        result.phones = phone.values.map(item => item.value);
    }

    if (clientStatus) {
        result.clientStatus = ClientStatuses.find(source => source.displayName === clientStatus?.values[0]?.value)?.key;
    }

    if (clientSource) {
        result.clientSources = ClientSources.find(source => source.displayName === clientSource?.values[0]?.value)?.key;
    }

    return result;
}

export async function saveContacts(developerUuid, contacts) {
    const existingContacts = await ContactModel.find({
        developer: mongoose.Types.ObjectId(developerUuid),
        isDeleted: false
    });

    const existingAmoSet = new Map();
    existingContacts.forEach((c) => {
        existingAmoSet.set(c.amoId, c);
    })

    const contactsToUpdate = [];
    contacts.forEach((newContact) => {
        if (existingAmoSet.has(newContact.amoId)) {
            const updated = existingAmoSet.get(newContact.amoId);
            Object.assign(updated, newContact);
            contactsToUpdate.push(updated);
        } else {
            contactsToUpdate.push(newContact);
        }
    });

    await Promise.all(contactsToUpdate.map(contact => {
        return ContactModel.update({
            developer: mongoose.Types.ObjectId(developerUuid),
            isDeleted: false,
            amoId: contact.amoId
        }, {
            $set: {
                ...contact
            }
        }, {
            upsert: true
        })
    }));
}

export async function mapContacts(amoContacts = []) {
    return amoContacts.map((contact) => {
        return mapCustomFieldsToContact(contact);
    });
}
