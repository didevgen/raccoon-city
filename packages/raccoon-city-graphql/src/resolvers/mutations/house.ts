import arrayMove from 'array-move';
import ApartmentComplexModel from '../../db/models/apartmentComplex';
import {FlatModel} from '../../db/models/flat';
import HouseModel, {House} from '../../db/models/house';
import {LevelModel} from '../../db/models/level';
import {SectionModel} from '../../db/models/section';
import {HouseImageServiceFactory} from '../../services/image/houseImageServiceFactory';
import {HouseDataInputArgs} from '../../types/house';
import {Context} from '../../utils';

export const house = {
    async createHouse(parent, args, ctx: Context): Promise<House> {
        const houseData: HouseDataInputArgs = args.houseData;
        const apartmentComplexId = args.apartmentComplexId;
        const houseDataObj = {
            apartmentComplex: apartmentComplexId,
            ...houseData
        };
        return await HouseModel.create(houseDataObj, (err, res) => {
            ApartmentComplexModel.findById(apartmentComplexId, (error, doc) => {
                doc.houses.push(res);
                doc.save();
            });
        });
    },
    async addHouseImage(parent, args, ctx: Context) {
        return new HouseImageServiceFactory(args.mode)
            .getImageService(ctx.Firebase, args.uuid, args.name)
            .addImage(await args.file);
    },
    async deleteHouseImage(parent, args, ctx: Context) {
        await new HouseImageServiceFactory(args.mode)
            .getImageService(ctx.Firebase, args.uuid)
            .removeImage(args.imageId);
        return 'Success';
    },
    async addLevel(parent, {sectionId}, ctx: Context) {
        const section = await SectionModel.findById(sectionId)
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
        await FlatModel.deleteMany({level: levelId}).exec();
        const {section} = await LevelModel.findById(levelId).exec();
        await LevelModel.findByIdAndRemove(levelId).exec();
        const existingLevels = await LevelModel.find({section})
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
        const existingLevels = await LevelModel.find({section: sectionId})
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
        await FlatModel.deleteMany({section: sectionId}).exec();
        await LevelModel.deleteMany({section: sectionId}).exec();
        await SectionModel.findByIdAndRemove(sectionId).exec();
        return true;
    }
};
