import {HouseLayout} from './layout.types';

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
    sale: string;
    level: string;
    section: string;
    area: string;
    squarePrice: string;
    status: FlatStatus;
    roomAmount: string;
    levelAmount: string;
}

export interface Flat {
    id: string;
    flatNumber: string;
    levelAmount: number;
    price: number;
    sale?: number;
    level: number;
    section: string;
    area: number;
    squarePrice: number;
    status: FlatStatus;
    roomAmount: string;
    belongsToLayout?: boolean;
    hasLayout?: boolean;
    layout?: HouseLayout;
    isActive?: boolean;
}
