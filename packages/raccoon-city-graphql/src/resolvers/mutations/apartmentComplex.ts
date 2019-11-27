import {Context} from '../../utils';
import {ApartmentComplexInputArgs} from 'apartment_complex';
import ApartmentComplexModel, {ApartmentComplex} from '../../db/models/apartmentComplex';
import {appendImage, removeImage} from '../../services/apartmentComplex/image.service';

function getFileExtension(fileName: string): string {
    return fileName.split('.').pop();
}
export const apartmentComplex = {
    async createApartmentComplex(parent, args, ctx: Context): Promise<ApartmentComplex> {
        const apartmentComplex: ApartmentComplexInputArgs = args.apartmentComplex;
        return await ApartmentComplexModel.create(apartmentComplex);
    },
    async addImage(parent, args, ctx: Context) {
        return await appendImage(args, ctx.Firebase);
    },
    async deleteImage(parent, args, ctx: Context) {
        await removeImage(args, ctx.Firebase);
        return 'Success'
    }
};
