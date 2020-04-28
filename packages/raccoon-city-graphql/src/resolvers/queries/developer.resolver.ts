import {DeveloperModel} from '../../db/models/developer';

export const developerQuery = {
    async getDevelopers() {
        return DeveloperModel.find({
            isDeleted: false
        }).exec();
    },
    async getDeveloper(_, {uuid}) {
        return DeveloperModel.findOne({_id: uuid, isDeleted: false}).exec();
    }
};
