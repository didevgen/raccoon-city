import Papa from 'papaparse';
import groupBy from 'ramda/src/groupBy';
import {GroupedFlatsByHouse, SpreadsheetFlat} from '../../types/flat/flat';
import {UploadedFile} from '../image/imageService';
import {transformHeader} from './headerUtils';
import {transofrmValue} from './valueUtils';

interface ParseResult {
    house: string;
    flats: SpreadsheetFlat[];
}
export class ApartmentComplexSpreadsheetService {
    constructor(private file: UploadedFile) {}

    public async parse(): Promise<ParseResult[]> {
        return new Promise((resolve) => {
            const result: SpreadsheetFlat[] = [];
            const writableStream = this.file.createReadStream().pipe(
                Papa.parse(Papa.NODE_STREAM_INPUT, {
                    encoding: 'utf8',
                    header: true,
                    skipEmptyLines: true,
                    transformHeader,
                    transform: transofrmValue
                })
            );

            writableStream.on('data', (resultItem) => {
                const {
                    house,
                    flatNumber,
                    price,
                    level,
                    section,
                    area,
                    status,
                    roomAmount,
                    squarePrice,
                    levelAmount
                } = resultItem;
                if (house && flatNumber && price && level && section && status) {
                    result.push({
                        house,
                        flatNumber,
                        price,
                        level,
                        section,
                        area,
                        status,
                        roomAmount,
                        squarePrice,
                        levelAmount
                    });
                }
            });

            writableStream.on('end', () => {
                resolve(this.groupByHouse(result));
            });
        });
    }

    private groupByHouse(flats: SpreadsheetFlat[]): ParseResult[] {
        const groupByFn = groupBy((flat: SpreadsheetFlat) => {
            return flat.house;
        });
        const groupedFlats: GroupedFlatsByHouse = groupByFn(flats);
        return Object.entries(groupedFlats).map(([key, value]) => {
            return {
                house: key,
                flats: value
            };
        });
    }
}
