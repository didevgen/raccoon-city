import ApartmentComplexModel from '../../db/models/apartmentComplex';

export const apartmentComplex = {
    getAllApartmentComplexes: async () => {
        return ApartmentComplexModel.find({});
    }
};
