import {apartmentComplexTypes} from '../../constants/apartmentComplexTypes';
import {cities} from '../../constants/cities';
import {complexClasses} from '../../constants/complexClasses';
import ApartmentComplexModel, {ApartmentComplex} from '../../db/models/apartmentComplex';
import {FlatService} from '../../db/services/flat.service';
import {ApartmentComplexImageServiceFactory} from '../../services/image/apartmentComplexImageServiceFactory';
import {ApartmentComplexSpreadsheetService} from '../../services/spreadsheets/apartmentComplexSpreadsheetService';
import {ApartmentComplexInputArgs, AssignFlatInputArgs} from '../../types/apartment_complex';
import {Context} from '../../utils';
import {HouseLayoutModel} from '../../db/models/houseLayout';

export const apartmentComplex = {
    async createApartmentComplex(parent, args, ctx: Context): Promise<ApartmentComplex> {
        const apartmentComplexArg: ApartmentComplexInputArgs = args.apartmentComplex;
        const result = {...apartmentComplexArg} as any;

        const {key, displayName, districts} = cities.find((type) => type.key === apartmentComplexArg.city);
        const district = districts.find((type) => String(type.key) === apartmentComplexArg.district);

        result.city = {key, displayName};
        result.district = district;
        result.type = apartmentComplexTypes.find((type) => type.key === apartmentComplexArg.type);
        result.class = complexClasses.find((type) => type.key === apartmentComplexArg.class);
        return await ApartmentComplexModel.create(result);
    },
    async updateApartmentComplex(parent, args, ctx: Context): Promise<ApartmentComplex> {
        const apartmentComplexArg: ApartmentComplexInputArgs = args.apartmentComplex;
        const uuid = args.uuid;
        const result = {...apartmentComplexArg} as any;

        const {key, displayName, districts} = cities.find((type) => type.key === apartmentComplexArg.city);
        const district = districts.find((type) => String(type.key) === apartmentComplexArg.district);

        result.city = {key, displayName};
        result.district = district;
        result.type = apartmentComplexTypes.find((type) => type.key === apartmentComplexArg.type);
        result.class = complexClasses.find((type) => type.key === apartmentComplexArg.class);
        return await ApartmentComplexModel.findOneAndUpdate(
            {
                _id: uuid
            },
            {
                $set: {
                    ...result
                }
            }
        ).exec();
    },
    async deleteApartmentComplex(parent, {uuid}, ctx: Context) {
        await ApartmentComplexModel.deleteOne({_id: uuid}).exec();
        return true;
    },
    async addImage(parent, args, ctx: Context) {
        return new ApartmentComplexImageServiceFactory(args.mode)
            .getImageService(ctx.Firebase, args.uuid, args.name)
            .addImage(await args.file);
    },
    async deleteImage(parent, args, ctx: Context) {
        await new ApartmentComplexImageServiceFactory(args.mode)
            .getImageService(ctx.Firebase, args.uuid)
            .removeImage(args.imageId);
        return 'Success';
    },
    async uploadApartmentComplexFile(parent, args, ctx: Context) {
        return new ApartmentComplexSpreadsheetService(await args.file).parse();
    },
    async assignFlats(parent, args, ctx: Context) {
        const data: AssignFlatInputArgs[] = args.data;
        await Promise.all(
            data.map(async (house) => {
                return await new FlatService(house.houseId).assignFlatsToHouse(house.flats);
            })
        );
        return 'Success';
    }
};
