export interface City {
    key: string;
    displayName: string;
    districts: District[];
}

export interface District {
    key: string;
    displayName: string;
}

interface KeyDisplayName {
    key: string;
    displayName: string;
}

export interface ApartmentComplexDTO {
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

export interface ApartmentComplexFormValues {
    type: KeyDisplayName;
    name: string;
    city: City;
    district: District;
    class: KeyDisplayName;
    levels: string;
    sections: string;
    price: string;
    beginDate: string;
    endDate: string;
}
