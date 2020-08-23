// TODO refactor
export enum ViewModeValues {
    AREA = 'area',
    ROOM = 'roomAmount',
    NUMBER = 'flatNumber'
}

// TODO refactor
export enum ChessCellViewMode {
    TILE = 'tile',
    TILE_PLUS = 'tilePlus',
    LIST = 'list'
}

export const initialState = {
    selectedViewMode: ViewModeValues.AREA,
    selectedRoomAmount: {},
    price: {
        minPrice: 0,
        maxPrice: 0
    },
    area: {
        minArea: 0,
        maxArea: 0
    },
    mode: ChessCellViewMode.TILE
};

export function reducer(state, action) {
    switch (action.type) {
        case 'mode':
            return {...state, selectedViewMode: action.payload};
        case 'roomAmount':
            return {...state, selectedRoomAmount: action.payload};
        case 'price':
            return {...state, price: action.payload};
        case 'area':
            return {...state, area: action.payload};
        case 'minMaxInit':
            return {...state, area: action.payload.area, price: action.payload.price};
        case 'cellViewMode':
            return {...state, mode: action.payload};
        default:
            throw new Error();
    }
}
