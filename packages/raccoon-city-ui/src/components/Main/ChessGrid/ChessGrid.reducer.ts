import {ViewModeValues, ChessCellViewMode} from './ChessEnums';

export const getInitialState = (isPublic: boolean) => ({
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
    mode: isPublic ? ChessCellViewMode.FLOOR : ChessCellViewMode.TILE
});

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
