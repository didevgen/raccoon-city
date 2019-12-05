import ApartmentComplexModel from '../../db/models/apartmentComplex';
import HouseModel from '../../db/models/house';

export const hosueQuery = {
    getHouses: async (parent, {apartmentComplexId}) => {
        const data = await ApartmentComplexModel.findById(apartmentComplexId).populate('houses');
        if (data) {
            return data.houses || [];
        } else {
            return [];
        }
    },
    getHouse: async (parent, {uuid}) => {
        return HouseModel.findById(uuid);
    }
};
