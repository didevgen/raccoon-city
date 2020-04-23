import {UserModel} from '../../db/models/user';

export const user = {
    async getUserInfo(parent, args, context) {
        try {
            return UserModel.findOne({where: {id: context.currentUser.id}});
        } catch (e) {
            return null;
        }
    }
};
