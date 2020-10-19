export interface ViewBoxInterface {
    height: number;
    width: number;
}

export interface SvgInfoInterface {
    id: string;
    image: null | string;
    paths: string[];
    viewBox: ViewBoxInterface;
}

export interface FlatInfoInterface {
    area: number;
    flatNumber: string;
    id: string;
    layout: string;
    level: string;
    levelAmount: number;
    price: number;
    roomAmount: string;
    squarePrice: string;
    status: string;
}

export interface FullFlatInfoInterface {
    flatInfo: FlatInfoInterface;
    svgInfo: SvgInfoInterface;
}

export interface LevelImageUrlInterface {
    previewImageUrl: string;
}
