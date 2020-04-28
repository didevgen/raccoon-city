import HouseModel from '../../db/models/house';
import {Level} from '../../db/models/level';
import {LevelFlatLayoutModel} from '../../db/models/levelFlatLayout';
import {LevelLayoutModel} from '../../db/models/levelLayout';
import {Section} from '../../db/models/section';

export const levelQuery = {
    async getLevelLayouts(_, {houseId}) {
        return LevelLayoutModel.find({house: houseId, isDeleted: false}).populate('levels');
    },
    async getSelectedLevelLayouts(_, {levelLayoutId, houseId}) {
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
                        path: 'layouts',
                        match: {
                            _id: levelLayoutId,
                            isDeleted: false
                        }
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
                        return {
                            id: level.id,
                            level: level.levelNumber,
                            isSelected: level.layouts.length > 0
                        };
                    })
                };
            });
        } else {
            return [];
        }
    },
    async getLevelLayoutFlatLayouts(_, {levelLayoutId}) {
        return LevelFlatLayoutModel.find({
            levelLayout: levelLayoutId,
            isDeleted: false
        })
            .populate({
                path: 'flatLayout',
                match: {
                    isDeleted: false
                }
            })
            .exec();
    }
};
