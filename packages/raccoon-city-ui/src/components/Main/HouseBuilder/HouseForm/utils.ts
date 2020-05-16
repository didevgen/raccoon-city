export interface HouseFormValues {
    name: string;
    price: number;
    parking: string;
}

export function getHouseDataVariables(houseData: HouseFormValues) {
    const {name, price, parking} = houseData;
    return {
        name,
        price: Number(price),
        parking: parking === 'true'
    };
}
