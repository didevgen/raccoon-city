import {Context} from '../../utils';
import {ApartmentComplexInputArgs} from '../../types/apartment_complex';
import ApartmentComplexModel, {ApartmentComplex} from '../../db/models/apartmentComplex';
import { uuid } from 'uuidv4';
import * as fs from 'fs';
import {appendImage} from '../../services/apartmentComplex/image.service';

function getFileExtension(fileName: string): string {
    return fileName.split('.').pop();
}
export const apartmentComplex = {
    async createApartmentComplex(parent, args, ctx: Context): Promise<ApartmentComplex> {
        const apartmentComplex: ApartmentComplexInputArgs = args.apartmentComplex;
        return await ApartmentComplexModel.create(apartmentComplex);
    },
    async addImage(parent, {file: filePromise, uuid: apartmentComplexId, mode}, ctx: Context) {
        const {Firebase} = ctx;
        const file = await filePromise;
        const imageUuid = uuid();
        const newFileName = `${imageUuid}.${getFileExtension(file.filename)}`;
        const fileUrl = `./uploadedFiles/${newFileName}`;
        try {
            const writeStream = fs.createWriteStream(fileUrl);
            const fileStream = file.createReadStream();
            const pipedStream = fileStream.pipe(writeStream);
            await new Promise((resolve, reject) => {
                pipedStream.on('finish', () => {
                    resolve();
                });
            });
            const bucket = Firebase.storage().bucket();

            const uploadedFileData = await bucket.upload(fileUrl, {
                gzip: true,
                metadata: {
                    cacheControl: 'public, max-age=31536000'
                }
            });
            const fileData = uploadedFileData[0];
            const config = {action: 'read', expires: '01-01-2025'};
            // @ts-ignore
            const [downloadUrl] = await fileData.getSignedUrl(config);
            await appendImage({
                mode,
                downloadUrl,
                imageUuid,
                apartmentComplexId
            });
            return {
                downloadUrl
            };
        } finally {
            fs.unlinkSync(fileUrl);
        }

    }
};
