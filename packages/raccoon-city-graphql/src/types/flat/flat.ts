export enum FlatStatus {
    SOLD_OUT = 'SOLD_OUT',
    FREE = 'FREE',
    RESERVED = 'RESERVED',
    BOOKED = 'BOOKED',
    UNAVAILABLE = 'UNAVAILABLE',
    DOCUMENTS_IN_PROGRESS = 'DOCUMENTS_IN_PROGRESS'
}

export interface SpreadsheetFlat {
    house: string;
    flatNumber: string;
    price: string;
    level: string;
    section: string;
    area: string;
    status: FlatStatus;
    roomAmount: string;
    squarePrice: string;
}

export interface GroupedFlatsByHouse {
    [key: string]: SpreadsheetFlat[];
}

export interface Flat {
    flatNumber: number;
    price: number;
    level: number;
    section: string;
    area: number;
    status: FlatStatus;
    roomAmount: string;
    squarePrice: string;
    house: string;
}

export interface IdFlat extends Flat {
    id: string;
}
