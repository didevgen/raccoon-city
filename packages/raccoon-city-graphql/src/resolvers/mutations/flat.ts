import {FlatModel} from '../../db/models/flat';
import HouseModel from '../../db/models/house';
import {IdFlat} from '../../types/flat/flat';
import {Context} from '../../utils';

export const flatMutation = {
    async updateFlat(parent, args, ctx: Context) {
        const flat: IdFlat = args.flat;
        return FlatModel.findOneAndUpdate({_id: flat.id}, {...flat}, {new: true});
    },
    async createFlat(parent, args, ctx: Context) {
        const flat = args.flat;
        const house = await HouseModel.findById(args.houseGuid)
            .populate('flats')
            .exec();
        if (house) {
            flat.house = args.houseGuid;
            const newFlat = await FlatModel.create(flat);
            house.flats.push(newFlat);
            await house.save();
            return newFlat;
        }
        return null;
    },
    async deleteFlat(parent, {uuid}, ctx: Context) {
        await FlatModel.deleteOne({_id: uuid}).exec();
        return true;
    },
    async addLevel(parent, {uuid, section}, ctx: Context) {
        const house = await HouseModel.findById(uuid)
            .populate('flats', null, {section: 1})
            .sort('-levels')
            .exec();
        /*if (house) {
            const newFlat = await FlatModel.create({
                section,
                levels: 1
            });
            house.flats.push(newFlat);
            await house.save();
            return true;
        }*/

        return false;
    }
};
