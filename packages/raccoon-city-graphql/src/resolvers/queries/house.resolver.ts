import {Types} from 'mongoose';
import groupBy from 'ramda/src/groupBy';
import ApartmentComplexModel from '../../db/models/apartmentComplex';
import {Flat, FlatModel} from '../../db/models/flat';
import HouseModel from '../../db/models/house';
import {Level, LevelModel} from '../../db/models/level';
import {Section, SectionModel} from '../../db/models/section';

import mongoose from 'mongoose';

const groupBySection = groupBy((flat: Flat) => {
    return flat.section;
});

const groupByLevel = groupBy((flat: Flat) => {
    return flat.level;
});

export const hosueQuery = {
    getHouses: async (parent, {apartmentComplexId}) => {
        const data = await ApartmentComplexModel.findById(apartmentComplexId).populate('houses');
        if (data) {
            return data.houses || [];
        } else {
            return [];
        }
    },
    getHouse: async (parent, {uuid}) => {
        return HouseModel.findById(uuid);
    },
    getFlats: async (parent, {uuid}) => {
        const data = await HouseModel.findById(uuid).populate('flats');
        if (data) {
            return data.flats || [];
        } else {
            return [];
        }
    },
    getGroupedFlatsBySection: async (parent, {uuid}) => {
        const data = await HouseModel.findById(uuid)
            .populate({
                path: 'sections',
                options: {sort: {sectionName: 1}},
                populate: {
                    path: 'levels',
                    options: {sort: {levelNumber: -1}},
                    populate: {
                        path: 'flats',
                        options: {sort: {flatNumber: 1}},
                        populate: {
                            path: 'layout'
                        }
                    }
                }
            })
            .exec();
        const [result] = await FlatModel.aggregate([
            {$match: {house: mongoose.Types.ObjectId(uuid)}},
            {
                $group: {
                    _id: null,
                    maxPrice: {$max: '$price'},
                    minPrice: {$min: '$price'},
                    maxArea: {$max: '$area'},
                    minArea: {$min: '$area'}
                }
            }
        ]).exec();
        const {maxPrice, minPrice, maxArea, minArea} = result;
        if (data && data.sections) {
            return {
                maxPrice,
                minPrice,
                maxArea,
                minArea,
                groupedFlats: data.sections.map((section: Section) => {
                    return {
                        id: section.id,
                        section: section.sectionName,
                        levels: section.levels.map((level: Level) => {
                            const newFlat = {
                                level: level.levelNumber,
                                section: section.sectionName
                            };
                            const flats = level.flats.map((flat) => {
                                return {
                                    ...flat.toObject(),
                                    ...newFlat
                                };
                            });
                            return {
                                id: level.id,
                                level: level.levelNumber,
                                flats
                            };
                        })
                    };
                })
            };
        } else {
            return {
                groupedFlats: []
            };
        }
    },
    getSectionData: async (parent, {sectionId}) => {
        const section = await SectionModel.findById(sectionId)
            .populate({
                path: 'levels',
                options: {sort: {levelNumber: -1}},
                populate: {
                    path: 'flats',
                    options: {sort: {flatNumber: 1}}
                }
            })
            .exec();
        if (section) {
            return {
                id: section.id,
                section: section.sectionName,
                levels: section.levels.map((level: Level) => {
                    const newFlat = {
                        level: level.levelNumber,
                        section: section.sectionName
                    };
                    const flats = level.flats.map((flat) => {
                        return {
                            ...flat.toObject(),
                            ...newFlat
                        };
                    });
                    return {
                        id: level.id,
                        level: level.levelNumber,
                        flats
                    };
                })
            };
        } else {
            return null;
        }
    },
    getMaxLevelInSection: async (_, {sectionId}) => {
        const [result] = await LevelModel.find({section: sectionId}, 'levelNumber')
            .sort({levelNumber: -1})
            .limit(1)
            .exec();
        return result ? result.levelNumber : 0;
    }
};
