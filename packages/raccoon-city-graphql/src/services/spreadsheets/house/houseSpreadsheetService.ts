import Papa from 'papaparse';
import {format, parseISO} from 'date-fns';
import {House} from '../../../db/models/house';
import {FlatStatus} from '../../../types/flat/flat';
import {ApartmentComplex} from '../../../db/models/apartmentComplex';

const statusMap = new Map();
statusMap.set(FlatStatus.FREE, 'Свободно');
statusMap.set(FlatStatus.BOOKED, 'Забронировано');
statusMap.set(FlatStatus.DOCUMENTS_IN_PROGRESS, 'Оформление документов');
statusMap.set(FlatStatus.RESERVED, 'Резерв');
statusMap.set(FlatStatus.SOLD_OUT, 'Продано');
statusMap.set(FlatStatus.UNAVAILABLE, 'Недоступно');

function mapToPapa(house: House): any[] {
    return house.flats.map((flat) => {
        return {
            'Дом': house.name,
            'Номер квартиры': flat.flatNumber,
            'Этаж': flat.level.levelNumber,
            'Полная стоимость': flat.price,
            'Подъезд': flat.section.sectionName,
            'Общая площадь, м2': flat.area,
            'Статус': statusMap.get(flat.status),
            'Кол-во комнат': flat.roomAmount,
            'Цена, м2': flat.squarePrice || '',
            'Уровни': flat.levelAmount || '',
            'Акция, м2': flat.squarePriceSale || ''
        };
    });
}

export function houseToCsv(house: House) {
    return Papa.unparse(mapToPapa(house), {
        header: true
    });
}

export function apartmentComplexToCsv(apartmentComplex: ApartmentComplex) {
    return Papa.unparse(
        apartmentComplex.houses.reduce((acc, house) => {
            return [...acc, ...mapToPapa(house)];
        }, []),
        {
            header: true
        }
    );
}
