import {Context} from '../../utils';
import {ApartmentComplexInputArgs} from '../../types/apartment_complex';
import ApartmentComplexModel, {ApartmentComplex} from '../../db/models/apartmentComplex';
import * as firebase from 'firebase';

export const apartmentComplex = {
    async createApartmentComplex(parent, args, ctx: Context): Promise<ApartmentComplex> {
        const apartmentComplex: ApartmentComplexInputArgs = args.apartmentComplex;
        return await ApartmentComplexModel.create(apartmentComplex);
    },
    async addImage(parent, {file}, ctx: Context) {
        const {Firebase} = ctx;
        const f = await file;
        const storageRef = Firebase.storage().ref();
        const uploadTask: firebase.storage.UploadTask = storageRef.put(f);
        const promise = new Promise<string>((resolve, reject) => {
            uploadTask.on('state_changed', () => {
                uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                    resolve(downloadURL);
                });
            });
        });
        const downloadUrl = await promise;
        return {
            downloadUrl
        };
    }
};
