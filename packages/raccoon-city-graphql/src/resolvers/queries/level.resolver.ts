import HouseModel from '../../db/models/house';
import {Level} from '../../db/models/level';
import {LevelFlatLayoutModel} from '../../db/models/levelFlatLayout';
import {LevelLayoutModel} from '../../db/models/levelLayout';
import {Section} from '../../db/models/section';
import {PublishedHouseModel} from '../../db/models/publishedHouse';

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
            isDeleted: false
        });
        const houseResult: any[] = await Promise.all(houseLayouts);

        return houseResult;
    },
    async getFlatsLayoutsByIds(_, {levelId, houseId, flatsIds}) {
        // REMOVE
        const layoutDbResponse: any = await LevelLayoutModel.findOne({
            house: houseId,
            levels: {$in: levelId},
            isDeleted: false
        }).exec();

        // REMOVE
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

        // TODO USE THIS
        // const levelTest: any = await LevelModel.findOne({
        //     _id: levelId,
        //     isDeleted: false,
        // })
        //     .populate({
        //         path: 'layouts',
        //         match: {
        //             isDeleted: false
        //         }
        //     })
        //     .populate({
        //         path: 'flats',
        //         match: {
        //             isDeleted: false
        //         }
        //     })
        //     .exec();

        // TODO USE THIS
        // const levelTestFlatIds = levelTest.flats.map(({id}) => id);

        // const levelFlatsLayoutsTest = await LevelFlatLayoutModel.find({
        //     flatLayout: {$in: levelTestFlatIds},
        //     isDeleted: false,
        // })
        //     .populate({
        //         path: 'flatLayout',
        //         match: {
        //             isDeleted: false
        //         }
        //     })
        //     .exec();

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

        return {
            image: {
                previewImageUrl: layoutDbResponse?.image?.previewImageUrl
            },
            fullFlatsInfo
        };
    },
    async getPublishedFlatsLayoutByHouseId(_, {
        houseId,
        sectionId,
        levelId,
    }) {
        const publishedHouse: any = await PublishedHouseModel.findOne({
            _id: houseId,
            isDeleted: false
        }).exec();

        const {layouts, levelLayouts, sections} = publishedHouse;

        // GET FLATS INFO
        const appropriateSection = (
            sections.find(({_id}) => String(_id) === String(sectionId))
        );
        const flats = (
            appropriateSection.levels.find(({_id}) => String(_id) === String(levelId))
        );

        if (!flats) {
            return [];
        }

        const {flats: flatsInfo} = flats;

        const levelLayout = levelLayouts.find(({levels}) => {
            return levels.some((level) => String(level) === String(levelId));
        });

        if (!levelLayout) {
            return [];
        }

        const tmpArray = [];
        layouts.forEach((item) => {
            levelLayout.flatLayouts.forEach((flatLayout) => {
                if (String(flatLayout.flatLayout) === String(item._id)) {
                    tmpArray.push({
                        layout: item,
                        flatLayout: flatLayout,
                    });
                }
            });
        })

        const fullFlatsInfo = [];
        tmpArray.forEach((tempItem) => {
            tempItem.layout.flats.forEach((flatId) => {
                flatsInfo.forEach((flatInfo) => {
                    if (String(flatInfo._id) === String(flatId)) {
                        const paths = tempItem.flatLayout.path.map((path) => String(path));
                        fullFlatsInfo.push({
                            svgInfo: {
                                paths,
                                id: String(tempItem.flatLayout._id),
                                flatLayout: [""],
                                viewBox: {
                                    width: tempItem.flatLayout.viewBox.width,
                                    height: tempItem.flatLayout.viewBox.height,
                                },
                                image: {},
                            },
                            flatInfo,
                        });
                    }
                });
            });
        });

        if (!levelLayout) {
            return [];
        }

        return {
            fullFlatsInfo,
            image: {
                previewImageUrl: levelLayout.image.previewImageUrl
            },
        };
    }
};
