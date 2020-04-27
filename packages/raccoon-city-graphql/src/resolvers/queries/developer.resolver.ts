import {DeveloperModel} from '../../db/models/developer';

export const developerQuery = {
    async getDevelopers() {
        return DeveloperModel.find().exec();
    },
    async getDeveloper(_, {uuid}) {
        return DeveloperModel.findById(uuid).exec();
    }
};
