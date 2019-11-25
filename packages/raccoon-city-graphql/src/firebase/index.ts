import * as admin from 'firebase-admin';

export function initFirebase() {
    return admin.initializeApp({
        credential: admin.credential.cert({
                'type': 'service_account',
                'project_id': 'raccoon-city-74eff',
                'private_key_id': process.env.FB_PRIVATE_KEY_ID,
                'private_key': process.env.FB_PRIVATE_KEY.replace(/\\n/g, '\n'),
                'client_email': 'firebase-adminsdk-ahgyi@raccoon-city-74eff.iam.gserviceaccount.com',
                'client_id': '116806846704337226040',
                'auth_uri': 'https://accounts.google.com/o/oauth2/auth',
                'token_uri': 'https://oauth2.googleapis.com/token',
                'auth_provider_x509_cert_url': 'https://www.googleapis.com/oauth2/v1/certs',
                'client_x509_cert_url': 'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-ahgyi%40raccoon-city-74eff.iam.gserviceaccount.com'
            } as any
        ),
        databaseURL: 'https://raccoon-city-74eff.firebaseio.com',
        storageBucket: 'gs://raccoon-city-74eff.appspot.com/'
    });
}
