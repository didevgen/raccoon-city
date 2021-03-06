import {ApartmentComplexDTO, ApartmentComplexFormValues} from '../../../shared/types/apartmentComplex.types';

export function getApartmentComplexVariables(apartmentComplex: ApartmentComplexFormValues): ApartmentComplexDTO {
    const {type, name, city, district, levels, sections, price, beginDate, endDate, address} = apartmentComplex;
    return {
        type,
        name,
        city,
        district,
        address,
        class: apartmentComplex.class,
        levels: Number(levels),
        sections: Number(sections),
        price: Number(price),
        beginDate,
        endDate
    };
}
