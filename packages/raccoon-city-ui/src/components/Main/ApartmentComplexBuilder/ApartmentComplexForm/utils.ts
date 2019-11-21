import {ApartmentComplexDTO, ApartmentComplexFormValues} from '../../../shared/types/apartmentComplex.types';

export function getApartmentComplexVariables(apartmentComplex: ApartmentComplexFormValues): ApartmentComplexDTO {
    const {type, name, city, district, levels, sections, price, beginDate, endDate} = apartmentComplex;
    return {
        type: {
            key: type.key,
            displayName: type.displayName
        },
        name,
        city: {
            key: city.key,
            displayName: city.displayName
        },
        district: {
            key: district.key,
            displayName: district.displayName
        },
        class: {
            key: apartmentComplex.class.key,
            displayName: apartmentComplex.class.displayName
        },
        levels: Number(levels),
        sections: Number(sections),
        price: Number(price),
        beginDate,
        endDate
    };
}
