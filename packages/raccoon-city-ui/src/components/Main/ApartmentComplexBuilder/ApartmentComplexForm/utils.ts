import {ApartmentComplexDTO, ApartmentComplexFormValues} from '../../../shared/types/apartmentComplex.types';

export function getApartmentComplexVariables(apartmentComplex: ApartmentComplexFormValues): ApartmentComplexDTO {
    const {type, name, city, district, levels, sections, price, beginDate, endDate} = apartmentComplex;
    return {
        type,
        name,
        city,
        district,
        class: apartmentComplex.class,
        levels: Number(levels),
        sections: Number(sections),
        price: Number(price),
        beginDate,
        endDate
    };
}
