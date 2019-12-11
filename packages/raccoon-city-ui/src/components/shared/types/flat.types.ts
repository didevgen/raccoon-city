export enum FlatStatus {
    SOLD_OUT = 'SOLD_OUT',
    FREE = 'FREE',
    RESERVED = 'RESERVED',
    BOOKED = 'BOOKED',
    UNAVAILABLE = 'UNAVAILABLE',
    DOCUMENTS_IN_PROGRESS = 'DOCUMENTS_IN_PROGRESS'
}

export interface ParsedFlat {
    house: string;
    flatNumber: string;
    price: string;
    level: string;
    dormitory: string;
    area: string;
    status: FlatStatus;
    roomAmount: string;
}

export interface Flat {
    flatNumber: number;
    price: number;
    level: number;
    dormitory: number;
    area: number;
    status: FlatStatus;
    roomAmount: number;
}
