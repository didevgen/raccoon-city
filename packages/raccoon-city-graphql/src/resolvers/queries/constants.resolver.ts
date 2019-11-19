import {cities} from '../../constants/cities';
import {apartmentComplexTypes} from '../../constants/apartmentComplexTypes';
import {complexClasses} from '../../constants/complexClasses';

export const constants = {
    cities: () => {
        return cities;
    },
    apartmentComplexTypes: () => {
        return apartmentComplexTypes;
    },
    apartmentComplexClasses: () => {
        return complexClasses;
    }
};
