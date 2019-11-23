import * as admin from 'firebase-admin';

const serviceAccount = require(process.env.GOOGLE_APPLICATION_CREDENTIALS);

export function initFirebase() {
    return admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://raccoon-city-c14f4.firebaseio.com",
        storageBucket: "gs://raccoon-city-c14f4.appspot.com"
    });
}
