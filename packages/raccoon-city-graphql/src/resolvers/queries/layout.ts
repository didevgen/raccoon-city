import HouseModel from '../../db/models/house';
import {HouseLayoutModel} from '../../db/models/houseLayout';
import {Level} from '../../db/models/level';
import {Section} from '../../db/models/section';

export const layoutQuery = {
    async getFlatLayouts(_, {houseId}) {
        return HouseLayoutModel.find({house: houseId, isDeleted: false}).populate({
            path: 'flats',
            match: {
                isDeleted: false
            }
        });
    },
    async getFlatLayout(_, {layoutId}) {
        return HouseLayoutModel.findOne({_id: layoutId, isDeleted: false}).populate({
            path: 'flats',
            match: {
                isDeleted: false
            }
        });
    },
    getChessGridLayout: async (parent, {houseId, layoutId}) => {
        const data = await HouseModel.findById(houseId)
            .populate({
                path: 'sections',
                match: {
                    isDeleted: false
                },
                options: {sort: {sectionName: 1}},
                populate: {
                    path: 'levels',
                    match: {
                        isDeleted: false
                    },
                    options: {sort: {levelNumber: -1}},
                    populate: {
                        path: 'flats',
                        match: {
                            isDeleted: false
                        },
                        options: {sort: {flatNumber: 1}}
                    }
                }
            })
            .exec();
        if (data && data.sections) {
            return data.sections.map((section: Section) => {
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
                                ...newFlat,
                                belongsToLayout: flat.layout && flat.layout.toString() === layoutId,
                                hasLayout: !!flat.layout
                            };
                        });
                        return {
                            id: level.id,
                            level: level.levelNumber,
                            flats
                        };
                    })
                };
            });
        } else {
            return [];
        }
    }
};
