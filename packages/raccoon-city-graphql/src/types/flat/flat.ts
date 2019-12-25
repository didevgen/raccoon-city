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
    entrance: string;
    area: string;
    status: FlatStatus;
    roomAmount: string;
}

export interface GroupedFlatsByHouse {
    [key: string]: SpreadsheetFlat[];
}

export interface Flat {
    flatNumber: number;
    price: number;
    level: number;
    entrance: number;
    area: number;
    status: FlatStatus;
    roomAmount: number;
}

export interface IdFlat extends Flat {
    id: string;
}
