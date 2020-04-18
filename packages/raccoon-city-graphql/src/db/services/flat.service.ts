import difference from 'ramda/src/difference';
import groupBy from 'ramda/src/groupBy';
import intersection from 'ramda/src/intersection';
import HouseModel, {House} from '../../db/models/house';
import {Flat, SpreadsheetFlat} from '../../types/flat/flat';
import {FlatModel} from '../models/flat';
import {Level, LevelModel} from '../models/level';
import {Section, SectionModel} from '../models/section';

function spreadsheetFlatToFlat(flat: SpreadsheetFlat, houseId: string): Flat {
    return {
        flatNumber: Number(flat.flatNumber),
        price: Number(flat.price),
        level: Number(flat.level),
        section: flat.section,
        area: Number(flat.area),
        status: flat.status,
        roomAmount: flat.roomAmount,
        house: houseId,
        squarePrice: flat.squarePrice
    };
}

function convertToMapOfFlats(flats: SpreadsheetFlat[], houseId: string) {
    const result = new Map<number, Flat>();
    flats.forEach((flat) => {
        result.set(Number(flat.flatNumber), spreadsheetFlatToFlat(flat, houseId));
    });
    return result;
}

function convertToFlatArray(flatMap: Map<number, Flat>) {
    return [...flatMap.entries()].map(([k, flat]) => {
        return flat;
    });
}

const groupBySection = groupBy((flat: Flat) => {
    return flat.section;
});

export class FlatService {
    constructor(private houseId: string) {}

    public async assignFlatsToHouse(flats: SpreadsheetFlat[]): Promise<void> {
        const house = await this.getPopulatedHouse();
        const existingSectionsWithLevels = this.getLevelsGroupedBySection(house);

        const newFlatsMap = convertToMapOfFlats(flats, this.houseId);

        const newFlatNumbers: number[] = [...newFlatsMap.keys()];
        const oldFlatNumbers = house.flats.map((i) => Number(i.flatNumber));

        const {missingSections, existingSections} = this.getExistingAndMissingSections(
            convertToFlatArray(newFlatsMap),
            existingSectionsWithLevels
        );

        const newSections = await this.handleMissingSections(missingSections);
        const sectionMap = new Map([...existingSections, ...newSections]);

        const flatNumbersToUpdate = intersection(oldFlatNumbers, newFlatNumbers);
        const flatNumbersToCreate = difference(newFlatNumbers, flatNumbersToUpdate);

        this.handleExistingFlats(flatNumbersToUpdate, sectionMap, newFlatsMap);
        this.handleNewFlats(flatNumbersToCreate, sectionMap, newFlatsMap);
    }

    private async getPopulatedHouse(): Promise<House> {
        return await HouseModel.findById(this.houseId)
            .populate({
                path: 'sections',
                populate: {
                    path: 'levels'
                }
            })
            .populate('flats')
            .exec();
    }

    private async handleExistingFlats(
        flatNumbersToUpdate: number[],
        sectionMap: Map<string, {section: Section; levels: Level[]}>,
        newFlatsMap: Map<number, Flat>
    ) {
        for (const num of flatNumbersToUpdate) {
            const updateFlatValues = newFlatsMap.get(num);
            const sectionEntry = sectionMap.get(updateFlatValues.section);
            const section = sectionEntry.section;
            const level = await this.handleLevel(sectionEntry, updateFlatValues);
            const result = {
                ...updateFlatValues,
                section: section._id,
                level: level._id
            };
            await FlatModel.updateOne(
                {flatNumber: num, house: this.houseId},
                {
                    $set: {
                        ...result
                    }
                }
            );
        }
    }

    private async handleNewFlats(
        flatNumbersToCreate: number[],
        sectionMap: Map<string, {section: Section; levels: Level[]}>,
        newFlatsMap: Map<number, Flat>
    ) {
        const newFlats: Flat[] = flatNumbersToCreate.map((num) => {
            return newFlatsMap.get(num);
        });

        for (const newFlat of newFlats) {
            const sectionEntry = sectionMap.get(newFlat.section);
            const section = sectionEntry.section;
            const level = await this.handleLevel(sectionEntry, newFlat);
            newFlat.section = section.id;
            newFlat.level = level.id;
        }

        if (newFlats.length > 0) {
            await FlatModel.insertMany(newFlats);
        }
    }

    private async handleLevel(sectionEntry: {section: Section; levels: Level[]}, flat: Flat): Promise<Level> {
        const {section, levels} = sectionEntry;
        const existingLevel = levels.find((level) => level.levelNumber === flat.level);

        if (existingLevel) {
            return existingLevel;
        } else {
            const newLevel = await LevelModel.create({
                section: section.id,
                levelNumber: flat.level
            });

            sectionEntry.levels.push(newLevel);
            return newLevel;
        }
    }

    private getLevelsGroupedBySection(house: House) {
        const sectionMap = new Map<string, {section: Section; levels: Level[]}>();

        house.sections.forEach((section) => {
            sectionMap.set(section.sectionName, {
                section,
                levels: section.levels
            });
        });

        return sectionMap;
    }

    private getExistingAndMissingSections(flats: Flat[], sectionMap: Map<string, {section: Section; levels: Level[]}>) {
        const groupedBySections = groupBySection(flats);
        const existingSections = new Map<string, {section: Section; levels: Level[]}>();
        const missingSections = new Map<string, Flat[]>();

        Object.keys(groupedBySections).forEach((key) => {
            if (sectionMap.has(key)) {
                existingSections.set(key, sectionMap.get(key));
            } else {
                missingSections.set(key, groupBySection[key]);
            }
        });

        return {
            existingSections,
            missingSections
        };
    }

    private async handleMissingSections(missingSections: Map<string, Flat[]>) {
        const sectionNames = [...missingSections.entries()].map(([k, v]) => {
            return k;
        });

        const sections = await Promise.all(
            sectionNames.map(async (sectionName) => {
                return await SectionModel.create({
                    house: this.houseId,
                    sectionName
                });
            })
        );

        const result = new Map<string, {section: Section; levels: Level[]}>();
        sectionNames.forEach((name, i) => {
            result.set(name, {section: sections[i], levels: []});
        });

        return result;
    }
}
