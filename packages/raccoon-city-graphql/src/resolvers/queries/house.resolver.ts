import ApartmentComplexModel from '../../db/models/apartmentComplex';
import HouseModel from '../../db/models/house';
import groupBy from 'ramda/src/groupBy';
import {Flat} from '../../db/models/flat';

const groupByEntrance = groupBy((flat: Flat) => {
    return flat.entrance;
});

const groupByLevel = groupBy((flat: Flat) => {
    return flat.level;
});

export const hosueQuery = {
    getHouses: async (parent, {apartmentComplexId}) => {
        const data = await ApartmentComplexModel.findById(apartmentComplexId).populate('houses');
        if (data) {
            return data.houses || [];
        } else {
            return [];
        }
    },
    getHouse: async (parent, {uuid}) => {
        return HouseModel.findById(uuid);
    },
    getFlats: async (parent, {uuid}) => {
        const data = await HouseModel.findById(uuid).populate('flats');
        if (data) {
            return data.flats || [];
        } else {
            return [];
        }
    },
    getGroupedFlatsByEntrance: async (parent, {uuid}) => {
        const data = await HouseModel.findById(uuid).populate('flats');
        if (data && data.flats) {
            const flatsByEntrance = groupByEntrance(data.flats);
            return Object.entries(flatsByEntrance).map(([key, value]) => {
                const flatsByLevel = groupByLevel(value);
                return {
                    entrance: key,
                    level: Object.entries(flatsByLevel).map(([level, flats]) => {
                        return {
                            level,
                            flats
                        };
                    })
                };
            });
        } else {
            return [];
        }
    }
};
