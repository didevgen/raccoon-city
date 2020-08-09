export function getConstant(dropdowns, state, appropriateConstant) {
    const result = dropdowns[appropriateConstant].find(({key}) => key === state);

    if (!result) {
        return null;
    }

    return result.displayName;
}

export function getClientInterests(dropdowns, interests) {
    return dropdowns.clientInterests
        .map(({key, displayName}) => {
            let interest = '';

            if (interests.some((item: string) => item === key)) {
                interest = displayName;
            }

            return interest;
        })
        .join(' ');
}

export function getAppropriateItems(items, start, stop) {
    return items.reduce((acc, item, index) => {
        if (index >= start && index <= stop) {
            return [...acc, index];
        }

        return acc;
    }, []);
}

export function searchTradesHelper(tradeItems, toSearch) {
    return tradeItems.some((item) => {
        const updatedItem = String(item).toLocaleLowerCase();
        const updatedToSearch = toSearch.toLocaleLowerCase();

        return updatedItem.indexOf(updatedToSearch) !== -1;
    });
}
