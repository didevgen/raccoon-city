import {HouseDataInputArgs} from 'house';
import HouseModel, {House} from '../../db/models/house';
import ApartmentComplexModel from '../../db/models/apartmentComplex';
import {Context} from '../../utils';
import {HouseImageServiceFactory} from '../../services/image/houseImageServiceFactory';

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
    }
};
