import ApartmentComplexModel from '../../db/models/apartmentComplex';

export const apartmentComplex = {
    getAllApartmentComplexes: async () => {
        return ApartmentComplexModel.find({});
    },
    getApartmentComplex: async (parent, {uuid}) => {
        return ApartmentComplexModel.findById(uuid);
    }
};
