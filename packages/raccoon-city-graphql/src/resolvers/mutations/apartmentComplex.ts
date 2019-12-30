import ApartmentComplexModel, {ApartmentComplex} from '../../db/models/apartmentComplex';
import {FlatService} from '../../db/services/flat.service';
import {ApartmentComplexImageServiceFactory} from '../../services/image/apartmentComplexImageServiceFactory';
import {ApartmentComplexSpreadsheetService} from '../../services/spreadsheets/apartmentComplexSpreadsheetService';
import {ApartmentComplexInputArgs, AssignFlatInputArgs} from '../../types/apartment_complex';
import {Context} from '../../utils';

export const apartmentComplex = {
    async createApartmentComplex(parent, args, ctx: Context): Promise<ApartmentComplex> {
        const apartmentComplexArg: ApartmentComplexInputArgs = args.apartmentComplex;
        return await ApartmentComplexModel.create(apartmentComplexArg);
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
