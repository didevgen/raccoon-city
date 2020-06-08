import {cities} from '../../constants/cities';
import {apartmentComplexTypes} from '../../constants/apartmentComplexTypes';
import {complexClasses} from '../../constants/complexClasses';
import {userRoles} from '../../constants/userRoles';

export const constants = {
    cities: () => {
        return cities;
    },
    apartmentComplexTypes: () => {
        return apartmentComplexTypes;
    },
    apartmentComplexClasses: () => {
        return complexClasses;
    },
    userRoles: () => {
        return userRoles;
    }
};
