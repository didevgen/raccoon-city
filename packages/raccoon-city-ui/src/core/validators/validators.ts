import validate from 'validate.js';

export function getError(meta: any) {
    if (meta.error && meta.touched) {
        return meta.error;
    }

    return undefined;
}

export const isRequired = (value: any) => (value ? undefined : 'Обязательное поле');
export const isNumber = (value: any) => {
    return validate.isNumber(+value) ? undefined : 'Это числовое поле';
};
export const isInteger = (value: any) => {
    return validate.isInteger(+value) ? undefined : 'Это целое число';
};
export const isRequiredAndIsNumber = (value: any) => {
    return isRequired(value) || isNumber(value);
};
export const isRequiredAndIsInteger = (value: any) => {
    return isRequired(value) || isInteger(value);
};
