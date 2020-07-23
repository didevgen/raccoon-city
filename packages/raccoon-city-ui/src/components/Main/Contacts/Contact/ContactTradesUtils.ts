export function getConstant(dropdowns, state, appropriateConstant) {
    return dropdowns[appropriateConstant].find(({key}) => key === state).displayName;
}

export function getClientInterests(dropdowns, interests) {
    return dropdowns.clientInterests
        .map(({key, displayName}) => {
            if (interests.some((item: string) => item === key)) {
                return displayName;
            }
        })
        .join(' ');
}
