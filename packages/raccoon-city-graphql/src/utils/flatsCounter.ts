export interface CountedFlats {
    UNAVAILABLE: number;
    SOLD_OUT: number;
    RESERVED: number;
    DOCUMENTS_IN_PROGRESS: number;
    BOOKED: number;
    FREE: number;
}

const zeroValues = {
    UNAVAILABLE: 0,
    SOLD_OUT: 0,
    RESERVED: 0,
    DOCUMENTS_IN_PROGRESS: 0,
    BOOKED: 0,
    FREE: 0,
};

type FlatsToCount = {status: string, [key: string]: any}[];

export function countFlatsByStatus(flats: FlatsToCount): CountedFlats {
    const countedFlats = {...zeroValues};

    flats.forEach(({status}) => countedFlats[status] += 1);

    return countedFlats;
}