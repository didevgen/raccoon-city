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
    entrance: string;
    area: string;
    status: FlatStatus;
    roomAmount: string;
}

export interface Flat {
    id: string;
    flatNumber: number;
    price: number;
    level: number;
    entrance: number;
    area: number;
    status: FlatStatus;
    roomAmount: number;
}
