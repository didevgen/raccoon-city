import ApartmentComplexModel from '../../db/models/apartmentComplex';
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
    }
};
