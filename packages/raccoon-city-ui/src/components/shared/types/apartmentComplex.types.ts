interface KeyDisplayName {
    key: string;
    displayName: string;
}

export interface ApartmentComplexType {
    id: string;
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
