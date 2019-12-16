import difference from 'ramda/src/difference';
import intersection from 'ramda/src/intersection';
import HouseModel, {House} from '../../db/models/house';
import {Flat, FlatStatus, SpreadsheetFlat} from '../../types/flat/flat';
import {FlatModel} from '../models/flat';

function spreadsheetFlatToFlat(flat: SpreadsheetFlat): Flat {
    return {
        flatNumber: Number(flat.flatNumber),
        price: Number(flat.price),
        level: Number(flat.level),
        entrance: Number(flat.entrance),
        area: Number(flat.area),
        status: flat.status,
        roomAmount: Number(flat.roomAmount)
    };
}

function convertToMapOfFlats(flats: SpreadsheetFlat[]) {
    const result = new Map<number, Flat>();
    flats.forEach((flat) => {
        result.set(Number(flat.flatNumber), spreadsheetFlatToFlat(flat));
    });
    return result;
}

export class FlatService {
    public async assignFlatsToHouse(houseId: string, flats: SpreadsheetFlat[]): Promise<void> {
        const house = await HouseModel.findById(houseId)
            .populate('flats')
            .exec();

        const newFlatsMap = convertToMapOfFlats(flats);
        const newFlatNumbers: number[] = [...newFlatsMap.keys()];
        const oldFlatNumbers = house.flats.map((i) => Number(i.flatNumber));
        const flatNumbersToUpdate = intersection(oldFlatNumbers, newFlatNumbers);

        const flatNumbersToCreate = difference(newFlatNumbers, flatNumbersToUpdate);
        const bulk = FlatModel.collection.initializeUnorderedBulkOp();

        flatNumbersToUpdate.forEach((num) => {
            bulk.find({flatNumber: num}).updateOne({$set: {...newFlatsMap.get(num)}});
        });

        if (flatNumbersToUpdate.length > 0) {
            await bulk.execute();
        }

        const newFlats: Flat[] = flatNumbersToCreate.map((num) => {
            return newFlatsMap.get(num);
        });

        if (newFlats.length > 0) {
            await FlatModel.insertMany(newFlats, (insertErr, output) => {
                if (insertErr) {
                    return;
                }
                house.flats = [...house.flats, ...output];
                house.save();
            });
        }
    }
}
