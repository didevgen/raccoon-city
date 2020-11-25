import {GroupedFlats} from '../../../graphql/queries/houseQuery';
import {Flat} from '../../shared/types/flat.types';

export const flatStatusesWithoutPrice = ['SOLD_OUT', 'RESERVED', 'DOCUMENTS_IN_PROGRESS', 'UNAVAILABLE', 'BOOKED'];

function checkRoomAmount(flat, selectedRoomAmount) {
    if (!!selectedRoomAmount && Object.values(selectedRoomAmount).some((value) => !!value)) {
        return (
            selectedRoomAmount[flat.roomAmount] === true || (selectedRoomAmount['4+'] && Number(flat.roomAmount) >= 4)
        );
    }

    return true;
}

function checkPrice(flat: Flat, price, isPublic) {
    if (isPublic && flatStatusesWithoutPrice.includes(flat.status)) {
        return true;
    }

    return price.minPrice <= flat.squarePrice && flat.squarePrice <= price.maxPrice;
}

function checkArea(flat: Flat, price) {
    return price.minArea <= flat.area && flat.area <= price.maxArea;
}

export function isActive(flat: Flat, filters, isPublic = false) {
    return (
        checkRoomAmount(flat, filters.selectedRoomAmount) &&
        checkPrice(flat, filters.price, isPublic) &&
        checkArea(flat, filters.area)
    );
}

export function showMutedFlats(items, filters, isPublic = false) {
    items.forEach((section: GroupedFlats) => {
        section.levels.forEach((level) => {
            level.flats.forEach((flat) => {
                flat.isActive = isActive(flat, filters, isPublic);
            });
        });
    });
    return items;
}
