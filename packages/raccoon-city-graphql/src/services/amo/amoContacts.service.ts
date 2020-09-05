import {ContactModel} from '../../db/models/contact';
import mongoose from "mongoose";

export async function saveContacts(developerUuid, amoContacts) {
    const existingContacts = await ContactModel.find({
        developer: mongoose.Types.ObjectId(developerUuid),
        isDeleted: false
    })
}

export async function mapContacts(amoContacts = []) {
    return amoContacts.map((contact) => {
        if (contact.custom_fields_values) {
            const phone = contact.custom_fields_values.find(field => {
                return field.field_code === 'PHONE';
            });
            return {
                id: contact.id,
                name: contact.name || `${contact.first_name || ''} ${contact.last_name || ''}`,
                phone: phone?.values[0]?.value
            }
        }

        return {
            id: contact.id,
            name: contact.name || `${contact.first_name || ''} ${contact.last_name || ''}`
        }
    })
}
