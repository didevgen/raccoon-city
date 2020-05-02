import {DeveloperModel} from '../../db/models/developer';

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
    }
};
