import {FlatStatus} from '../../types/flat/flat';

const statusMap = new Map();
statusMap.set('Свободно', FlatStatus.FREE);
statusMap.set('Забронировано', FlatStatus.BOOKED);
statusMap.set('Оформление документов', FlatStatus.DOCUMENTS_IN_PROGRESS);
statusMap.set('Резерв', FlatStatus.RESERVED);
statusMap.set('Продано', FlatStatus.SOLD_OUT);
statusMap.set('Недоступно', FlatStatus.UNAVAILABLE);

export function transofrmValue(value: string, field: string | number): any {
    if (field === 'status') {
        return statusMap.get(value) || value;
    }

    if (field === 'levelAmount') {
        if (!value) {
            return 1;
        }

        const result = Number(value);
        return isNaN(result) ? 1 : result;
    }

    if (field === 'price' || field === 'area') {
        const valueWithoutSpaces = value.replace(/\s/g, '').replace(/,/g, '.');
        const result = Number(valueWithoutSpaces);
        return isNaN(result) ? 0 : result;
    }

    if (field === 'sale') {
        const valueWithoutSpaces = value.replace(/\s/g, '').replace(/,/g, '.');
        const result = Number(valueWithoutSpaces);
        return isNaN(result) ? undefined : result;
    }

    return value;
}
