import {ContactModel} from '../../db/models/contact';
import mongoose from 'mongoose';
import {ClientSources, ClientStatuses} from '../../constants/tradeConstants';

function mapCustomFieldsToContact(amoContact) {
    const result: any = {};
    result.amoId = amoContact.id;
    result.name = amoContact.name || `${amoContact.first_name || ''} ${amoContact.last_name || ''}`;
    let customFieldsName = 'custom_fields_values';

    if (!amoContact[customFieldsName]) {
        return result;
    }

    if (!!amoContact[customFieldsName].find((field) => {
        return field.field_name === 'ID Основного контакта' // дубль
    })) {
        return null;
    }

    const phone = amoContact[customFieldsName].find((field) => {
        return field.field_code === 'PHONE';
    });

    const email = amoContact[customFieldsName].find((field) => {
        return field.field_code === 'EMAIL';
    });

    const position = amoContact[customFieldsName].find((field) => {
        return field.field_code === 'POSITION';
    });

    const clientStatus = amoContact[customFieldsName].find((field) => {
        return field.field_name === 'Статус клиента';
    });

    const clientSource = amoContact[customFieldsName].find((field) => {
        return field.field_name === 'Источник клиента';
    });

    if (phone) {
        result.phones = phone.values.map(item => item.value);
    }

    if (email) {
        result.email = email.values[0]?.value;
    }

    if (position) {
        result.position = position.values[0]?.value;
    }

    if (clientStatus) {
        result.clientStatus = ClientStatuses.find(source => source.displayName === clientStatus?.values[0]?.value)?.key;
    }

    if (clientSource) {
        result.clientSources = ClientSources.find(source => source.displayName === clientSource?.values[0]?.value)?.key;
    }

    return result;
}

function mapWebHookContact(amoContact) {
    const result: any = {};
    result.amoId = amoContact.id;
    result.name = amoContact.name || `${amoContact.first_name || ''} ${amoContact.last_name || ''}`;
    let customFieldsName = 'custom_fields';

    if (!amoContact[customFieldsName]) {
        return result;
    }

    if (!!amoContact[customFieldsName].find((field) => {
        return field.name === 'ID Основного контакта' // дубль
    })) {
        return null;
    }

    const phone = amoContact[customFieldsName].find((field) => {
        return field.code === 'PHONE';
    });

    const email = amoContact[customFieldsName].find((field) => {
        return field.code === 'EMAIL';
    });

    const position = amoContact[customFieldsName].find((field) => {
        return field.code === 'POSITION';
    });

    const clientStatus = amoContact[customFieldsName].find((field) => {
        return field.name === 'Статус клиента';
    });

    const clientSource = amoContact[customFieldsName].find((field) => {
        return field.name === 'Источник клиента';
    });

    if (phone) {
        result.phones = phone.values.map(item => item.value);
    }

    if (email) {
        result.email = email.values[0]?.value;
    }

    if (position) {
        result.position = position.values[0]?.value;
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
    }, {lean: true});

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
    }).filter(Boolean);
}

export async function mapWebHookContacts(amoContacts = []) {
    return amoContacts.map((contact) => {
        return mapWebHookContact(contact);
    }).filter(Boolean);
}
