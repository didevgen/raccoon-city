import {mapWebHookContacts, saveContacts} from '../services/amo/amoContacts.service';
import {ContactModel} from '../db/models/contact';

const express = require('express');
const router = express.Router();

router.post('/amo/contacts/:developerId/update', async (req, res) => {
    const postBody = req.body;
    const developerUuid = req.params.developerId;
    const {contacts} = postBody;
    const {update} = contacts;
    const contactToUpdate = update;
    if (contactToUpdate && contactToUpdate.length > 0) {
        const mapped = await mapWebHookContacts(contactToUpdate);
        await saveContacts(developerUuid, mapped);
    }
    res.status(200);
});

router.post('/amo/contacts/:developerId/create', async (req, res) => {
    const postBody = req.body;
    const developerUuid = req.params.developerId;
    const {contacts} = postBody;
    const {add} = contacts;
    const contactToUpdate = add;
    if (contactToUpdate && contactToUpdate.length > 0) {
        const mapped = await mapWebHookContacts(contactToUpdate);
        await saveContacts(developerUuid, mapped);
    }
    res.status(200);
});

router.post('/amo/contacts/:developerId/delete', async (req, res) => {
    const postBody = req.body;
    const {contacts} = postBody;
    const contactToDelete = contacts.delete;
    if (contactToDelete) {
        contactToDelete.forEach(async ({id}) => {
            await ContactModel.update({
                amoId: id
            }, {
                $set: {
                    isDeleted: true
                }
            })
        });
    }

    res.status(200);
});

module.exports = router;
