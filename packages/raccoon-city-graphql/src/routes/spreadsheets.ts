import {ContactModel} from '../db/models/contact';
import {contactsToCsv} from '../services/spreadsheets/contacts/contactSpreasheetService';
import {TradeModel} from '../db/models/trade';
import {tradesToCsv} from '../services/spreadsheets/trades/tradesSpreasheetService';
import {DeveloperModel} from '../db/models/developer';
import {logger} from '../aws/logger';
import HouseModel from '../db/models/house';
import {apartmentComplexToCsv, houseToCsv} from '../services/spreadsheets/house/houseSpreadsheetService';
import ApartmentComplexModel from '../db/models/apartmentComplex';

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

router.get('/healthcheck', async (req, res) => {
    res.status(200).send('connected');
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

router.get('/spreadsheets/house/:houseId', async (req, res) => {
    try {
        const houseId = req.params.houseId;
        if (!houseId) {
            return res.status(400).send('No houseId');
        }
        const house = await HouseModel.findById(houseId).populate({
            path: 'flats',
            match: {
                isDeleted: false
            },
            populate: [{
                path: 'level',
                match: {
                    isDeleted: false
                }
            }, {
                path: 'section',
                match: {
                    isDeleted: false
                }
            }]
        }).exec();
        if (!house) {
            return res.status(404).send('No house');
        }
        const csv = `\uFEFF${houseToCsv(house)}`;
        const fileName = encodeURIComponent(`${house.name}.csv`);
        res.setHeader('Content-type', 'text/csv; charset=utf-8');
        res.setHeader('Content-disposition', `attachment; filename=${fileName}`);
        res.send(csv);
    } catch (e) {
        logger.error(e);
        res.status(500).send('error');
    }
});

router.get('/spreadsheets/apartmentComplex/:apartmentComplexId', async (req, res) => {
    try {
        const apartmentComplexId = req.params.apartmentComplexId;
        if (!apartmentComplexId) {
            return res.status(400).send('No apartmentComplexId');
        }
        const apartmentComplex = await ApartmentComplexModel.findById(apartmentComplexId).populate({
            path: 'houses',
            match: {
                isDeleted: false
            },
            populate: {
                path: 'flats',
                match: {
                    isDeleted: false
                },
                populate: [{
                    path: 'level',
                    match: {
                        isDeleted: false
                    }
                }, {
                    path: 'section',
                    match: {
                        isDeleted: false
                    }
                }]
            }
        }).exec();
        if (!apartmentComplex) {
            return res.status(404).send('No Apartment Complex');
        }
        const csv = `\uFEFF${apartmentComplexToCsv(apartmentComplex)}`;
        const fileName = encodeURIComponent(`${apartmentComplex.name}.csv`);
        res.setHeader('Content-type', 'text/csv; charset=utf-8');
        res.setHeader('Content-disposition', `attachment; filename=${fileName}`);
        res.send(csv);
    } catch (e) {
        logger.error(e);
        res.status(500).send('error');
    }
});

module.exports = router;
