import {UserModel} from '../../db/models/user';
import {AuthError} from '../../utils';

export const user = {
    async getUsers() {
        return UserModel.find({});
    },
    async getUserInfo(parent, args, context) {
        try {
            return await UserModel.findById(context.currentUser.id);
        } catch (e) {
            throw new AuthError();
        }
    }
};
