export interface HouseFormValues {
    name: string;
    price: number;
    parking: string;
    order: number;
}

export function getHouseDataVariables(houseData: HouseFormValues) {
    const {name, price, parking, order} = houseData;
    return {
        name,
        price: Number(price),
        parking: parking === 'true',
        order: Number(order)
    };
}
