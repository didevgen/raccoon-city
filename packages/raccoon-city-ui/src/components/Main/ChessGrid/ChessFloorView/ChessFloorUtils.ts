export const getSections = (groupedFlats) => {
    return groupedFlats.reduce((acc, section) => {
        const {id} = section;

        return {...acc, [id]: {...section}};
    }, {});
};

export const getFlatsIds = (groupedFlats, currentSection, currentFloor) => {
    const {levels} = groupedFlats.find(({id}) => id === currentSection);
    const flats = levels.find(({id}) => id === currentFloor);

    if (!flats) {
        return [];
    }

    return flats.flats.reduce((acc, {id}) => [...acc, id], []);
};

export const getImageUrl = (data, currentFloor) => {
    const {getLevelLayoutsToChessView: levels} = data;

    let img = '';

    levels.forEach((itme) => {
        itme.levels.forEach((item) => {
            if (item === currentFloor) {
                img = itme.image;
            }
        });
    });

    return img;
};
