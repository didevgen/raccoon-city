import {ApartmentComplexImages, KeyDisplayName} from './apartmentComplex.types';

// tslint:disable-next-line:no-empty-interface
export interface HouseImages extends ApartmentComplexImages {}
export interface House {
    name: string;
    class: KeyDisplayName;
    levels: number;
    price: number;
    beginDate: string;
    endDate: string;
    apartmentComplex: string;
    images: HouseImages;
}
