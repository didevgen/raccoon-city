import {HouseDataInputArgs} from 'house';
import HouseModel, {House} from '../../db/models/house';
import ApartmentComplexModel from '../../db/models/apartmentComplex';
import {Context} from '../../utils';

export const house = {
    async createHouse(parent, args, ctx: Context): Promise<House> {
        const houseData: HouseDataInputArgs = args.houseData;
        const apartmentComplexId = args.apartmentComplexId;
        const houseDataObj = {
            apartmentComplex: apartmentComplexId,
            ...houseData
        };
        return await HouseModel.create(houseDataObj, (err, res) => {
            ApartmentComplexModel.findById(apartmentComplexId, (error, doc) => {
                doc.houses.push(res);
                doc.save();
            });
        });
    }
};
