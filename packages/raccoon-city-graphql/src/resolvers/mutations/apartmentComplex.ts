import {Context} from '../../utils';
import {ApartmentComplexInputArgs} from '../../types/apartment_complex';
import ApartmentComplexModel, {ApartmentComplex} from '../../db/models/apartmentComplex';

export const apartmentComplex = {
    async createApartmentComplex(parent, args, ctx: Context): Promise<ApartmentComplex> {
        const apartmentComplex: ApartmentComplexInputArgs = args.apartmentComplex;
        return await ApartmentComplexModel.create(apartmentComplex);
    },
    async addImage(parent, { file }) {
        const { stream, filename, mimetype, encoding } = await file;
        console.log(stream, filename, mimetype, encoding)
        // 1. Validate file metadata.

        // 2. Stream file contents into cloud storage:
        // https://nodejs.org/api/stream.html

        // 3. Record the file upload in your DB.
        // const id = await recordFile( … )

        return { filename, mimetype, encoding };
    }
};
