import HouseModel from '../../db/models/house';
import {Level} from '../../db/models/level';
import {LevelFlatLayoutModel} from '../../db/models/levelFlatLayout';
import {LevelLayoutModel} from '../../db/models/levelLayout';
import {Section} from '../../db/models/section';
import {FlatModel} from '../../db/models/flat';
import {LevelModel} from '../../db/models/level';

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
    },
    async getLevelLayoutsToChessView(_, {houseId}) {
        const houseLayouts = await LevelLayoutModel.find({
            house: houseId,
            isDeleted: false,
        });
        const houseResult: any[] = await Promise.all(houseLayouts);

        return houseResult;
    },
    async getFlatsLayoutsByIds(_, {
        levelId,
        houseId,
        flatsIds
    }) {
        const layoutDbResponse: any = await LevelLayoutModel.findOne({
            house: houseId,
            levels: {$in: levelId},
            isDeleted: false
        }).exec();

        const house: any = await HouseModel.findOne({_id: houseId, isDeleted: false})
            .populate({
                path: 'layouts',
                match: {
                    isDeleted: false
                }
            })
            .populate({
                path: 'levelLayouts',
                match: {
                    isDeleted: false
                }
            })
            .populate({
                path: 'flats',
                match: {
                    isDeleted: false
                }
            })
            .exec();

        if (!house) {
            return [];
        }

        const {flats, layouts, levelLayouts} = house;

        if (!flats || !layouts) {
            return [];
        }

        const appropriateFlats = flats.filter(({id}) => {
            return flatsIds.some((flatId) => flatId === id);
        });

        const updatedFlats = layouts.reduce((acc, flatLayout) => {
            const {flats} = flatLayout;
            let isFlatConsist = false;
            let flatInfo = null;

            if (!flats.length) {
                return [...acc];
            }

            flats.forEach((flatId) => {
                appropriateFlats.forEach((flat) => {
                    if (String(flatId) === String(flat.id)) {
                        console.log(flatId, flat.id);

                        flatInfo = flat;
                        isFlatConsist = true;
                    }
                });
            });

            if (isFlatConsist) {
                return [
                    ...acc,
                    {
                        flatLayout: {
                            id: flatLayout.id,
                            name: flatLayout.name,
                            images: flatLayout.images,
                            image: flatLayout.image
                        },
                        flatInfo
                    }
                ];
            }

            return [...acc];
        }, []);

        const levelLayoutId = levelLayouts.find(({levels}) => {
            return levels.find((level) => String(level) === String(levelId));
        });

        const levelFlatsLayouts = await LevelFlatLayoutModel.find({
            flatLayout: {$in: updatedFlats.map(({flatLayout: {id}}) => String(id))},
            isDeleted: false,
            levelLayout: levelLayoutId
        })
            .populate({
                path: 'flatLayout',
                match: {
                    isDeleted: false
                }
            })
            .exec();

        const fullFlatsInfo = updatedFlats.reduce((acc, flat) => {
            const {flatLayout} = flat;

            const svgInfo = levelFlatsLayouts.find(({flatLayout: {id}}) => {
                console.log(id, flatLayout.id, id === flatLayout.id);

                return id === flatLayout.id;
            });

            if (svgInfo) {
                const {path, viewBox, id}: any = svgInfo;

                const paths = path.map((path) => String(path));

                return [
                    ...acc,
                    {
                        ...flat,
                        svgInfo: {
                            paths,
                            viewBox,
                            id,
                            image: flatLayout.image
                        }
                    }
                ];
            }

            return [...acc];
        }, []);

        console.log("STEP LAST");

        return {
            image: {
                previewImageUrl: layoutDbResponse?.image?.previewImageUrl
            },
            fullFlatsInfo
        };
    }
};
