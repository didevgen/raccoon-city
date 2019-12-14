import {KeyDisplayName} from '../shared';
import {SpreadsheetFlat} from '../flat/flat';

export interface ApartmentComplexInputArgs {
    type: KeyDisplayName;
    name: string;
    city: KeyDisplayName;
    district: KeyDisplayName;
    class: KeyDisplayName;
    levels: number;
    sections: number;
    price: number;
    beginDate: string;
    endDate: string;
}

export interface AssignFlatInputArgs {
    houseId: string;
    flats: SpreadsheetFlat[];
}
