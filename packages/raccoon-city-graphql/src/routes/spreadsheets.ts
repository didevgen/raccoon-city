import {ContactModel} from '../db/models/contact';
import {contactsToCsv} from '../services/spreadsheets/contacts/contactSpreasheetService';
import {TradeModel} from '../db/models/trade';
import {tradesToCsv} from '../services/spreadsheets/trades/tradesSpreasheetService';
import {DeveloperModel} from '../db/models/developer';
import {logger} from '../aws/logger';

const express = require('express');
const router = express.Router();

router.get('/spreadsheets/contacts/:developerId', async (req, res) => {
    try {
        const developerId = req.params.developerId;
        if (!developerId) {
            return res.status(400).send('No developerId');
        }
        const developer = await DeveloperModel.findById(developerId).exec();
        if (!developer) {
            return res.status(404).send('No developer');
        }
        const contacts = await ContactModel.find({
            developer: developerId,
            isDeleted: false
        })
            .populate('responsible')
            .exec();
        const csv = `\uFEFF${contactsToCsv(contacts)}`;
        const fileName = encodeURIComponent(`${developer.name}-contacts.csv`);
        res.setHeader('Content-type', 'text/csv; charset=utf-8');
        res.setHeader('Content-disposition', `attachment; filename=${fileName}`);
        res.send(csv);
    } catch (e) {
        logger.error(e);
        res.status(500).send('error');
    }
});

router.get('/spreadsheets/trades/:developerId', async (req, res) => {
    try {
        const developerId = req.params.developerId;
        if (!developerId) {
            return res.status(400).send('No developerId');
        }
        const developer = await DeveloperModel.findById(developerId).exec();
        if (!developer) {
            return res.status(404).send('No developer');
        }
        const trades = await TradeModel.find({
            developer: developerId,
            isDeleted: false
        })
            .populate('responsible')
            .exec();
        const csv = `\uFEFF${tradesToCsv(trades)}`;
        const fileName = encodeURIComponent(`${developer.name}-trades.csv`);
        res.setHeader('Content-type', 'text/csv; charset=utf-8');
        res.setHeader('Content-disposition', `attachment; filename=${fileName}`);
        res.send(csv);
    } catch (e) {
        logger.error(e);
        res.status(500).send('error');
    }
});

module.exports = router;
