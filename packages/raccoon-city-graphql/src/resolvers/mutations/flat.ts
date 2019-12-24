import {Context} from '../../utils';
import {IdFlat} from '../../types/flat/flat';
import {FlatModel} from '../../db/models/flat';

export const flatMutation = {
    async updateFlat(parent, args, ctx: Context) {
        const flat: IdFlat = args.flat;
        return FlatModel.findOneAndUpdate({_id: flat.id}, {...flat}, {new: true});
    }
};
