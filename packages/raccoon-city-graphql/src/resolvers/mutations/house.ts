import arrayMove from 'array-move';
import ApartmentComplexModel from '../../db/models/apartmentComplex';
import {FlatModel} from '../../db/models/flat';
import HouseModel, {House} from '../../db/models/house';
import {LevelModel} from '../../db/models/level';
import {SectionModel} from '../../db/models/section';
import {HouseImageServiceFactory} from '../../services/image/houseImageServiceFactory';
import {HouseDataInputArgs} from '../../types/house';
import {Context} from '../../utils';
import {PublishedHouseModel} from '../../db/models/publishedHouse';
import {logger} from './../../aws/logger';

export const house = {
    async createHouse(parent, args, ctx: Context): Promise<House> {
        const houseData: HouseDataInputArgs = args.houseData;
        const apartmentComplexId = args.apartmentComplexId;
        const houseDataObj = {
            apartmentComplex: apartmentComplexId,
            ...houseData
        };
        return await HouseModel.create(houseDataObj, (err, res) => {
            //When button 'AddSection' will be added remove this
            SectionModel.create({
                house: res._id,
                sectionName: '1'
            });
            //-----------------------------------------------------

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
        const dataSet = houseData.toObject();
        await PublishedHouseModel.update(
            {
                house: uuid
            },
            {
                $set: {
                    ...dataSet,
                    house: uuid,
                    publishedDate: new Date().toISOString()
                }
            },
            {upsert: true}
        ).exec();
        await HouseModel.update(
            {
                _id: uuid
            },
            {
                $set: {
                    publishedDate: new Date().toISOString()
                }
            }
        );
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
    },
    async addSection(parent, {uuid}) {
        try {
            const existingSections = await SectionModel.find({house: uuid, isDeleted: false}).exec();

            const maxSectionNumber = !existingSections.length ? 1 : Number(existingSections.length) + 1;

            await SectionModel.create({
                house: uuid,
                sectionName: maxSectionNumber.toString()
            });

            return true;
        } catch (e) {
            logger.log({
                level: 'error',
                message: e.message
            });
            return false;
        }
    }
};
