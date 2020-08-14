export const required = (value: string) => {
    return value ? undefined : 'Поле обязательно';
};

export const composeValidators = (...validators: any) => (value: any) => {
    return validators.reduce((error: any, validator: any) => error || validator(value), undefined);
};
