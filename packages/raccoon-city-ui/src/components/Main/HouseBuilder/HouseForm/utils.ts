export interface HouseFormValues {
    name: string;
    address: string;
    price: number;
    parking: string;
}

export function getHouseDataVariables(houseData: HouseFormValues) {
    const {name, address, price, parking} = houseData;
    return {
        name,
        address,
        price: Number(price),
        parking: parking === 'true'
    };
}
