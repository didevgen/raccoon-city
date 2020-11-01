export interface CountedFlats {
    label: string;
    count: number;
}

type FlatsToCount = {status: string; [key: string]: any}[];

export function countFlatsByStatus(flats: FlatsToCount): CountedFlats[] {
    const countedFlats: CountedFlats[] = [
        {
            label: "UNAVAILABLE",
            count: 0,
        },
        {
            label: "SOLD_OUT",
            count: 0,
        },
        {
            label: "RESERVED",
            count: 0,
        },
        {
            label: "DOCUMENTS_IN_PROGRESS",
            count: 0,
        },
        {
            label: "BOOKED",
            count: 0,
        },
        {
            label: "FREE",
            count: 0,
        }
    ];

    flats.forEach(({status}) => {
        countedFlats.forEach((item) => {
            if (item.label === status) {
                item.count += 1;
            }
        })
    });

    return countedFlats;
}
