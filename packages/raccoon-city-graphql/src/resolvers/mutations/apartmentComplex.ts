import {Context} from '../../utils';
import {ApartmentComplexInputArgs} from 'apartment_complex';
import ApartmentComplexModel, {ApartmentComplex} from '../../db/models/apartmentComplex';
import {ApartmentComplexImageServiceFactory} from '../../services/image/apartmentComplexImageServiceFactory';
import {ApartmentComplexSpreadsheetService} from '../../services/spreadsheets/apartmentComplexSpreadsheetService';

function getFileExtension(fileName: string): string {
    return fileName.split('.').pop();
}
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
        const service = new ApartmentComplexSpreadsheetService(await args.file, args.uuid);
        return JSON.stringify(await service.parse());
    }
};
