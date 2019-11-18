export interface City {
    key: string;
    displayName: string;
    districts: District[];
}

export interface District {
    key: string;
    displayName: string;
}