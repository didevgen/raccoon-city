import {DeveloperModel} from '../../db/models/developer';
import ApartmentComplexModel from '../../db/models/apartmentComplex';
import {PublishedHouseModel} from '../../db/models/publishedHouse';
import mongoose from 'mongoose';

export const developerQuery = {
    async getDevelopers() {
        return DeveloperModel.find({
            isDeleted: false
        }).exec();
    },
    async getDeveloper(_, {uuid}) {
        return DeveloperModel.findOne({_id: uuid, isDeleted: false}).exec();
    },
    async getApartmentComplexesByDeveloper(_, {uuid}) {
        const developer = await DeveloperModel.findById(uuid)
            .populate({
                path: 'apartmentComplexes',
                match: {isDeleted: false},
                populate: {
                    path: 'houses',
                    match: {isDeleted: false}
                }
            })
            .exec();
        if (!developer) {
            return [];
        }

        return developer.apartmentComplexes;
    },
    async getPublicApartmentComplexesByDeveloper(_, {uuid}) {
        const apartmentComplexes = await ApartmentComplexModel.find({
            developer: mongoose.Types.ObjectId(uuid)
        }).exec();
        const publishedHouses = await PublishedHouseModel.find({
            apartmentComplex: {
                $in: apartmentComplexes.map((item) => item.id)
            }
        }).exec();
        const res = apartmentComplexes.map((complex) => {
            const result = complex.toObject();
            result.houses = publishedHouses
                .filter((house) => {
                    return String(house.apartmentComplex) === String(complex._id);
                })
                .map((house) => house.toObject());
            return result;
        });

        return res || [];
    }
};
