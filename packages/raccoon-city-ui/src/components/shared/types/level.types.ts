import {Flat} from './flat.types';
import {LevelLayout} from './layout.types';

export interface Section {
    id: string;
    sectionName: string;
    levels: Level[];
    house: string;
}

export interface Level {
    id: string;
    levelNumber: number;
    flats: Flat[];
    layouts: LevelLayout[];
    section: Section;
}
