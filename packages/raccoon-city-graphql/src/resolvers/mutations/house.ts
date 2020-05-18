import arrayMove from 'array-move';
import omit from 'ramda/src/omit';
import ApartmentComplexModel from '../../db/models/apartmentComplex';
import {FlatModel} from '../../db/models/flat';
import HouseModel, {House} from '../../db/models/house';
import {HouseLayoutModel} from '../../db/models/houseLayout';
import {LevelModel} from '../../db/models/level';
import {LevelFlatLayoutModel} from '../../db/models/levelFlatLayout';
import {LevelLayoutModel} from '../../db/models/levelLayout';
import {SectionModel} from '../../db/models/section';
import {HouseImageServiceFactory} from '../../services/image/houseImageServiceFactory';
import {HouseDataInputArgs} from '../../types/house';
import {Context} from '../../utils';

function updateModel(Model, id, value, timestamp?) {
    const updateObj: any = {published: omit(['published'], value.toObject())};

    if (timestamp) {
        updateObj.publishedDate = timestamp;
    }

    return Model.updateOne(
        {
            _id: id
        },
        {
            $set: updateObj
        }
    ).exec();
}

export const house = {
    async createHouse(parent, args, ctx: Context): Promise<House> {
        const houseData: HouseDataInputArgs = args.houseData;
        const apartmentComplexId = args.apartmentComplexId;
        const houseDataObj = {
            apartmentComplex: apartmentComplexId,
            ...houseData
        };
        return await HouseModel.create(houseDataObj, (err, res) => {
            ApartmentComplexModel.findOne({_id: apartmentComplexId, isDeleted: false}, (error, doc) => {
                doc.houses.push(res);
                doc.save();
            });
        });
    },
    async deleteHouse(parent, {uuid}, ctx: Context) {
        await HouseModel.findOneAndUpdate({_id: uuid}, {$set: {isDeleted: true}}).exec();
        return true;
    },
    async updateHouse(parent, args, ctx: Context) {
        const houseData: HouseDataInputArgs = args.houseData;
        const uuid = args.uuid;
        return await HouseModel.findOneAndUpdate(
            {
                _id: uuid,
                isDeleted: false
            },
            {
                $set: {
                    ...houseData
                }
            }
        ).exec();
    },
    async publishHouse(parent, args, ctx: Context) {
        const uuid = args.uuid;
        const houseData = await HouseModel.findById(uuid)
            .populate([
                {
                    path: 'sections',
                    match: {isDeleted: false},
                    populate: {
                        path: 'levels',
                        match: {isDeleted: false},
                        populate: [
                            {
                                path: 'flats',
                                match: {isDeleted: false}
                            }
                        ]
                    }
                },
                {
                    path: 'layouts',
                    match: {isDeleted: false}
                },
                {
                    path: 'levelLayouts',
                    match: {isDeleted: false},
                    populate: {
                        path: 'flatLayouts',
                        match: {isDeleted: false}
                    }
                }
            ])
            .exec();

        const requests = [];

        requests.push(updateModel(HouseModel, houseData.id, houseData, new Date().toISOString()));

        houseData.layouts.forEach((layout) => {
            requests.push(updateModel(HouseLayoutModel, layout.id, layout));
        });
        houseData.levelLayouts.forEach((levelLayout) => {
            requests.push(updateModel(LevelLayoutModel, levelLayout.id, levelLayout));
            levelLayout.flatLayouts.forEach((flatLayout) => {
                requests.push(updateModel(LevelFlatLayoutModel, flatLayout.id, flatLayout));
            });
        });

        houseData.sections.forEach((section) => {
            requests.push(updateModel(SectionModel, section.id, section));

            section.levels.forEach((level) => {
                requests.push(updateModel(LevelModel, level.id, level));

                level.flats.forEach((flat) => {
                    requests.push(updateModel(FlatModel, flat.id, flat));
                });
            });
        });

        await Promise.all(requests);
        return true;
    },
    async addHouseImage(parent, args, ctx: Context) {
        return new HouseImageServiceFactory(args.mode).getImageService(args.uuid, args.name).addImage(await args.file);
    },
    async deleteHouseImage(parent, args, ctx: Context) {
        await new HouseImageServiceFactory(args.mode).getImageService(args.uuid).removeImage(args.imageId);
        return 'Success';
    },
    async addLevel(parent, {sectionId}, ctx: Context) {
        const section = await SectionModel.findOne({_id: sectionId, isDeleted: false})
            .populate({
                path: 'levels',
                options: {sort: {levelNumber: -1}}
            })
            .exec();
        const topLevel = section.levels[0];
        const levelNumber = topLevel ? topLevel.levelNumber + 1 : 1;
        await LevelModel.create({
            section: sectionId,
            levelNumber
        });
        return true;
    },
    async deleteLevel(parent, {levelId}) {
        await FlatModel.updateMany(
            {level: levelId},
            {
                $set: {
                    isDeleted: true
                }
            }
        ).exec();
        const {section} = await LevelModel.findById(levelId).exec();
        await LevelModel.findOneAndUpdate(
            {_id: levelId},
            {
                $set: {
                    isDeleted: true
                }
            }
        ).exec();
        const existingLevels = await LevelModel.find({section, isDeleted: false})
            .sort({levelNumber: 1})
            .exec();

        if (existingLevels.length > 0) {
            const bulk = LevelModel.collection.initializeUnorderedBulkOp();
            existingLevels.forEach((level, i) => {
                bulk.find({_id: level._id}).update({
                    $set: {
                        levelNumber: i + 1
                    }
                });
            });
            await bulk.execute();
        }
        return true;
    },
    async reorderLevels(_, {sectionId, newIndex, oldIndex}) {
        const existingLevels = await LevelModel.find({section: sectionId, isDeleted: false})
            .sort({levelNumber: -1})
            .exec();
        const movedLevels = arrayMove(existingLevels, oldIndex, newIndex);
        if (movedLevels.length > 0) {
            const bulk = LevelModel.collection.initializeUnorderedBulkOp();
            movedLevels.forEach((level, i) => {
                bulk.find({_id: level._id}).update({
                    $set: {
                        levelNumber: movedLevels.length - i
                    }
                });
            });
            await bulk.execute();
        }

        return true;
    },
    async deleteSection(parent, {sectionId}) {
        await FlatModel.updateMany(
            {section: sectionId},
            {
                $set: {
                    isDeleted: true
                }
            }
        ).exec();
        await LevelModel.updateMany(
            {section: sectionId},
            {
                $set: {
                    isDeleted: true
                }
            }
        ).exec();
        await SectionModel.findOneAndUpdate(
            {_id: sectionId},
            {
                $set: {
                    isDeleted: true
                }
            }
        ).exec();
        return true;
    }
};
