import {Context} from '../../utils';
import {ApartmentComplexInputArgs} from '../../types/apartment_complex';
import ApartmentComplexModel, {ApartmentComplex} from '../../db/models/apartmentComplex';

export const apartmentComplex = {
    async createApartmentComplex(parent, args, ctx: Context) {
        const apartmentComplex: ApartmentComplexInputArgs = args.apartmentComplex;
        const result: ApartmentComplex = await ApartmentComplexModel.create(apartmentComplex);
        return result;
    }
};
