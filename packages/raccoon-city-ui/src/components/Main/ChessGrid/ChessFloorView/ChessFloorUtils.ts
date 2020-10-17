import {FlatInfoInterface, FullFlatInfoInterface} from './ChessFloor.interfaces';

export const getSections = (groupedFlats) => {
    return groupedFlats.reduce((acc, section) => {
        const {id} = section;

        return {...acc, [id]: {...section}};
    }, {});
};

export function getInfo(fullFlatsInfo: FullFlatInfoInterface[], currentDataId: string): FlatInfoInterface | null {
    if (!fullFlatsInfo) {
        return null;
    }

    const info = fullFlatsInfo.find(({svgInfo}) => svgInfo.id === currentDataId);

    if (!info) {
        return null;
    }

    return info.flatInfo;
}

export function getFlatsToDraw(flatsInfo) {
    return flatsInfo.map(({svgInfo, flatInfo}) => ({
        ...svgInfo,
        status: flatInfo.status,
        flatInfo
    }));
}
