import Papa, {ParseResult} from 'papaparse';
import {UploadedFile} from '../image/imageService';
import {transformHeader} from './headerUtils';
import {transofrmValue} from './valueUtils';

export class ApartmentComplexSpreadsheetService {
    constructor(private file: UploadedFile, private apartmentComplexId: string) {}

    public async parse() {
        const promise = new Promise((resolve) => {
            const result = [];
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
                const {house, flatNumber, price, level, dormitory, area, status, roomAmount} = resultItem;
                if (house) {
                    result.push({house, flatNumber, price, level, dormitory, area, status, roomAmount});
                }
            });

            writableStream.on('end', (...args) => {
                resolve(result);
            });
        });
        return await promise;
    }
}
