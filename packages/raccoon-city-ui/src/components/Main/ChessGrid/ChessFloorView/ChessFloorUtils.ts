export const getSections = (groupedFlats) => {
    return groupedFlats.reduce((acc, section) => {
        const {id} = section;

        return {...acc, [id]: {...section}};
    }, {});
};

export function getInfo(fullFlatsInfo, currentDataId: string) {
    if (!fullFlatsInfo) {
        // TODO change null to another value
        return null;
    }

    const res = fullFlatsInfo.find(({svgInfo}) => svgInfo.id === currentDataId);

    return res?.flatInfo;
}

export function getFlatsToDraw(flatsInfo) {
    return flatsInfo.map(({svgInfo, flatInfo}) => ({
        ...svgInfo,
        status: flatInfo.status,
        flatInfo
    }));
}
