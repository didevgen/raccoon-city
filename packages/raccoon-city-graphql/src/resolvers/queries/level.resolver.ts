import HouseModel from '../../db/models/house';
import {Level, LevelModel} from '../../db/models/level';
import {LevelFlatLayoutModel} from '../../db/models/levelFlatLayout';
import {LevelLayoutModel} from '../../db/models/levelLayout';
import {Section} from '../../db/models/section';
import {PublishedHouseModel} from '../../db/models/publishedHouse';
import {shouldHidePriceInFlat} from './flat.resolver';

const convertPathsToString = (path) => {
    const converted = path.map((pathItem) => String(pathItem));

    return converted;
};

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
    async getFlatsLayoutsByIds(_, {levelId}) {
        const level: any = await LevelModel.findOne({
            _id: levelId,
            isDeleted: false
        })
            .populate({
                path: 'layouts',
                match: {isDeleted: false}
            })
            .populate({
                path: 'flats',
                match: {isDeleted: false}
            })
            .exec();

        const {flats, layouts: levelLayout} = level;

        if (!flats) {
            return [];
        }

        const flatIds = flats.reduce((acc, {layout}) => {
            return !layout ? [...acc] : [...acc, String(layout)];
        }, []);

        const flatSvgLayouts = await LevelFlatLayoutModel.find({
            flatLayout: {$in: flatIds},
            isDeleted: false
        })
            .populate({
                path: 'flatLayout',
                match: {
                    isDeleted: false
                }
            })
            .exec();

        if (!flatSvgLayouts) {
            return [];
        }

        if (!flats || !levelLayout) {
            return [];
        }

        const fullFlatsInfo = flats.reduce((acc, flatInfo) => {
            const {_id: flatId} = flatInfo;

            const svgInfo = flatSvgLayouts.find((svgInfo) => {
                const {flatLayout} = svgInfo;

                if (!flatLayout) {
                    return false;
                }

                return flatLayout.flats.some((flatIdInSvgInfo) => {
                    return String(flatIdInSvgInfo) === String(flatId);
                });
            });

            if (!svgInfo) {
                return [...acc];
            }

            const {
                _id: id,
                path,
                viewBox: {width, height}
            } = svgInfo as any;

            return [
                ...acc,
                {
                    flatInfo,
                    svgInfo: {
                        id: String(id),
                        paths: convertPathsToString(path),
                        viewBox: {width, height}
                    }
                }
            ];
        }, []);

        const levelUrl = levelLayout.find((levelLayout) => {
            return levelLayout.levels.some((id) => String(id) === String(levelId));
        });

        return {
            image: {
                previewImageUrl: levelUrl?.image?.previewImageUrl || ''
            },
            fullFlatsInfo
        };
    },
    async getPublishedFlatsLayoutByHouseId(_, {houseId, sectionId, levelId}) {
        const publishedHouse: any = await PublishedHouseModel.findOne({
            _id: houseId,
            isDeleted: false
        }).exec();

        const {layouts, levelLayouts, sections} = publishedHouse;

        const appropriateSection = sections.find(({_id}) => String(_id) === String(sectionId));
        const flats = appropriateSection.levels.find(({_id}) => String(_id) === String(levelId));

        if (!flats) {
            return {
                fullFlatsInfo: [],
                image: {
                    previewImageUrl: ''
                }
            };
        }

        const {flats: flatsInfo} = flats;

        const levelLayout = levelLayouts.find(({levels}) => {
            return levels.some((level) => String(level) === String(levelId));
        });

        if (!levelLayout) {
            return {
                fullFlatsInfo: [],
                image: {
                    previewImageUrl: levelLayout?.image.previewImageUrl
                }
            };
        }

        const flatsInfoWithLayouts = layouts.reduce((acc, layout) => {
            const {flatLayouts} = levelLayout;
            const {_id: layoutId} = layout;

            const flatLayout = flatLayouts.find((item) => {
                return String(item.flatLayout) === String(layoutId);
            });

            return !flatLayout ? [...acc] : [...acc, {layout, flatLayout}];
        }, []);

        const fullFlatsInfo = flatsInfoWithLayouts.reduce((acc, tempItem) => {
            const {
                layout: {flats},
                flatLayout
            } = tempItem;
            const {
                _id,
                path,
                viewBox: {width, height}
            } = flatLayout;
            let flatInfo = null;

            flats.forEach((flatId) => {
                // TODO use find instead for
                for (let i = 0; i < flatsInfo.length; i++) {
                    if (String(flatsInfo[i].id) === String(flatId)) {
                        flatInfo = flatsInfo[i];

                        break;
                    }
                }
            });

            return !flatInfo
                ? [...acc]
                : [
                      ...acc,
                      {
                          flatInfo,
                          svgInfo: {
                              paths: convertPathsToString(path),
                              id: String(_id),
                              viewBox: {width, height}
                          }
                      }
                  ];
        }, []);

        if (!levelLayout || !fullFlatsInfo.length) {
            return {
                fullFlatsInfo: [],
                image: {
                    previewImageUrl: levelLayout?.image.previewImageUrl
                }
            };
        }

        return {
            fullFlatsInfo: fullFlatsInfo.map((fullFlatInfo) => {
                const flatInfo = fullFlatInfo?.flatInfo;
                if (flatInfo && shouldHidePriceInFlat(flatInfo.status)) {
                    flatInfo.price = null;
                    flatInfo.squarePrice = null;
                    flatInfo.squarePriceSale = null;
                }

                return fullFlatInfo;
            }),
            image: {
                previewImageUrl: levelLayout.image.previewImageUrl
            }
        };
    }
};
