import {KeyDisplayName} from '../shared';

export interface ApartmentComplexInputArgs {
    type: KeyDisplayName;
    name: String;
    city: KeyDisplayName;
    district: KeyDisplayName;
    class: KeyDisplayName;
    levels: number;
    sections: number;
    price: number;
    beginDate: String
    endDate: String
}
