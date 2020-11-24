import mongoose from 'mongoose';
import groupBy from 'ramda/src/groupBy';
import ApartmentComplexModel from '../../db/models/apartmentComplex';
import {Flat, FlatModel} from '../../db/models/flat';
import HouseModel from '../../db/models/house';
import {Level, LevelModel} from '../../db/models/level';
import {Section, SectionModel} from '../../db/models/section';
import {PublishedHouseModel} from '../../db/models/publishedHouse';
import {maxPriceCalc, minPriceCalc} from './flat.resolver'

const groupBySection = groupBy((flat: Flat) => {
    return flat.section;
});

const groupByLevel = groupBy((flat: Flat) => {
    return flat.level;
});

export const hosueQuery = {
    getHouses: async (parent, {apartmentComplexId}) => {
        const data = await ApartmentComplexModel.findOne({_id: apartmentComplexId, isDeleted: false}).populate({
            path: 'houses',
            match: {isDeleted: false},
            options: {sort: {order: 'asc'}}
        });
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
        const data = await HouseModel.findOne({_id: uuid, isDeleted: false}).populate({
            path: 'flats',
            match: {isDeleted: false}
        });
        if (data) {
            return data.flats || [];
        } else {
            return [];
        }
    },
    getGroupedHouseData: async (parent, {uuid}) => {
        const house = await HouseModel.findById(uuid)
            .populate({
                path: 'sections',
                match: {isDeleted: false},
                options: {sort: {sectionName: 1}},
                populate: {
                    path: 'levels',
                    match: {isDeleted: false},
                    options: {sort: {levelNumber: -1}},
                    populate: {
                        path: 'flats',
                        match: {isDeleted: false},
                        options: {sort: {flatNumber: 1}},
                        populate: {
                            path: 'layout',
                            match: {isDeleted: false}
                        }
                    }
                }
            })
            .exec();

        return {
            groupedFlats: house.sections.map((section: Section) => {
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
    },
    getGroupedFlatsBySection: async (parent, {uuid}) => {
        const houses = await HouseModel.find({
            _id: {
                $in: uuid.map((item) => mongoose.Types.ObjectId(item))
            }
        })
            .populate({
                path: 'sections',
                match: {isDeleted: false},
                options: {sort: {sectionName: 1}},
                populate: {
                    path: 'levels',
                    match: {isDeleted: false},
                    options: {sort: {levelNumber: -1}},
                    populate: {
                        path: 'flats',
                        match: {isDeleted: false},
                        options: {sort: {flatNumber: 1}},
                        populate: {
                            path: 'layout',
                            match: {isDeleted: false}
                        }
                    }
                }
            })
            .exec();
        const [result] = await FlatModel.aggregate([
            {$match: {house: {$in: uuid.map((item) => mongoose.Types.ObjectId(item))}, isDeleted: false}},
            {
                $group: {
                    _id: null,
                    maxPrice: {$max: '$squarePrice'},
                    minPrice: {$min: '$squarePrice'},
                    maxArea: {$max: '$area'},
                    minArea: {$min: '$area'}
                }
            }
        ]).exec();
        let maxPrice = 0;
        let minPrice = 0;
        let maxArea = 0;
        let minArea = 0;

        const squarePrices: number[] = [];
        houses.forEach(house => house.sections.forEach(
            section => section.levels.forEach(
                level => level.flats.forEach(
                    flat => {
                        if(flat) squarePrices.push(flat.squarePrice)
                    }
                ))
            )
        );

        if (!!result) {
            maxPrice = maxPriceCalc(squarePrices);
            minPrice = minPriceCalc(squarePrices);
            maxArea = result.maxArea;
            minArea = result.minArea;
        }

        const res = {
            maxPrice,
            minPrice,
            maxArea,
            minArea,
            houseFlats: []
        };

        houses.forEach((data) => {
            if (data.sections) {
                res.houseFlats.push({
                    id: data.id,
                    name: data.name,
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
                });
            }
        });
        return res;
    },
    getFlatsList: async (parent, {uuid}) => {
        const houses = await HouseModel.find({
            _id: {
                $in: uuid.map((item) => mongoose.Types.ObjectId(item))
            }
        })
            .populate({
                path: 'sections',
                match: {isDeleted: false},
                options: {sort: {sectionName: 1}},
                populate: {
                    path: 'levels',
                    match: {isDeleted: false},
                    options: {sort: {levelNumber: -1}},
                    populate: {
                        path: 'flats',
                        match: {isDeleted: false},
                        options: {sort: {flatNumber: 1}},
                        populate: {
                            path: 'layout',
                            match: {isDeleted: false}
                        }
                    }
                }
            })
            .exec();

        const flatsList = [];

        houses.forEach((data) => {
            if (data.sections) {
                data.sections.forEach((section: Section) => {
                    section.levels.map((level: Level) => {
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

                        flats.forEach((flat) => {
                            flatsList.push(flat);
                        });
                    });
                });
            }
        });

        return flatsList;
    },
    getSectionData: async (parent, {sectionId}) => {
        const section = await SectionModel.findById(sectionId)
            .populate({
                path: 'levels',
                match: {isDeleted: false},
                options: {sort: {levelNumber: -1}},
                populate: {
                    path: 'flats',
                    match: {isDeleted: false},
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
        const [result] = await LevelModel.find({section: sectionId, isDeleted: false}, 'levelNumber')
            .sort({levelNumber: -1})
            .limit(1)
            .exec();
        return result ? result.levelNumber : 0;
    },
    getPublishedHouses: async (parent, {uuid}) => {
        const result = await PublishedHouseModel.find({
            apartmentComplex: uuid,
            isDeleted: false
        }).exec();
        if (result) {
            return result || [];
        } else {
            return [];
        }
    },
    getPublishedHouse: async (parent, {uuid}) => {
        return await PublishedHouseModel.findOne({
            house: uuid
        }).exec();
    },
};
