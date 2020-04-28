import mongoose from 'mongoose';
import ApartmentComplexModel from '../../db/models/apartmentComplex';

export const apartmentComplex = {
    getAllApartmentComplexes: async (_, {developerUuid}) => {
        return ApartmentComplexModel.find({
            isDeleted: false,
            developer: mongoose.Types.ObjectId(developerUuid)
        });
    },
    getApartmentComplex: async (parent, {uuid}) => {
        const apartmentComplexData = await ApartmentComplexModel.findOne({_id: uuid, isDeleted: false})
            .lean()
            .exec();
        return {
            ...apartmentComplexData,
            houses: async () => {
                if (apartmentComplexData) {
                    const data = await ApartmentComplexModel.findOne(apartmentComplexData).populate('houses');
                    if (data) {
                        return data.houses || [];
                    } else {
                        return [];
                    }
                } else {
                    return [];
                }
            }
        };
    }
};
