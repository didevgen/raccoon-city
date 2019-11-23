import {Context} from '../../utils';
import {ApartmentComplexInputArgs} from '../../types/apartment_complex';
import ApartmentComplexModel, {ApartmentComplex} from '../../db/models/apartmentComplex';
import * as firebase from 'firebase';
import * as fs from 'fs';

export const apartmentComplex = {
    async createApartmentComplex(parent, args, ctx: Context): Promise<ApartmentComplex> {
        const apartmentComplex: ApartmentComplexInputArgs = args.apartmentComplex;
        return await ApartmentComplexModel.create(apartmentComplex);
    },
    async addImage(parent, {file: filePromise}, ctx: Context) {
        const {Firebase} = ctx;
        const file = await filePromise;

        const writeStream = fs.createWriteStream(`./uploadedFiles/${file.filename}`);
        const fileStream = file.createReadStream();
        fileStream.pipe(writeStream);

        /*const bucket = await Firebase.storage().bucket().upload(`${__dirname}/tmp/${fileName}`, {
            gzip: true,
            metadata: {
                cacheControl: 'public, max-age=31536000',
            }});*/
        /*const uploadTask: firebase.storage.UploadTask = storageRef.put(file);
        const promise = new Promise<string>((resolve, reject) => {
            uploadTask.on('state_changed', () => {
                uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                    resolve(downloadURL);
                });
            });
        });
        const downloadUrl = await promise;*/
        return {
            downloadUrl: ''
        };
    }
};
