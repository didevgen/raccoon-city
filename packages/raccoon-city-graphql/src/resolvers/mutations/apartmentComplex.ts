import {Context} from '../../utils';
import {ApartmentComplexInputArgs} from '../../types/apartment_complex';
import ApartmentComplexModel, {ApartmentComplex} from '../../db/models/apartmentComplex';

export const apartmentComplex = {
    async createApartmentComplex(parent, args, ctx: Context): Promise<ApartmentComplex> {
        const apartmentComplex: ApartmentComplexInputArgs = args.apartmentComplex;
        console.log(apartmentComplex);
        return await ApartmentComplexModel.create(apartmentComplex);
    }
};
