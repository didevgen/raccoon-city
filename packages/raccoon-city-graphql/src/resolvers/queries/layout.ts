import HouseModel from '../../db/models/house';
import {HouseLayoutModel} from '../../db/models/houseLayout';
import {Level} from '../../db/models/level';
import {Section} from '../../db/models/section';

export const layoutQuery = {
    async getFlatLayouts(_, {houseId}) {
        return HouseLayoutModel.find({house: houseId}).populate('flats');
    },
    getChessGridLayout: async (parent, {houseId, layoutId}) => {
        const data = await HouseModel.findById(houseId)
            .populate({
                path: 'sections',
                options: {sort: {sectionName: 1}},
                populate: {
                    path: 'levels',
                    options: {sort: {levelNumber: -1}},
                    populate: {
                        path: 'flats',
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
                                belongsToLayout: flat.layout && flat.layout.toString() === layoutId
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
