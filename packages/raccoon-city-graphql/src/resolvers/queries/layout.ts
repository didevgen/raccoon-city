import {HouseLayoutModel} from '../../db/models/houseLayout';

export const layoutQuery = {
    async getLayouts(_, {houseId}) {
        return HouseLayoutModel.find({house: houseId}).exec();
    }
};
