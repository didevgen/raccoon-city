import * as admin from 'firebase-admin';

export interface Uploadable {
    upload(fileUrl: string, fileName: string): Promise<string>;
    remove(imageUuid: string): Promise<void>;
}

export class FirebaseImageUploader implements Uploadable {
    private readonly EXPIRES = '01-01-2025';

    constructor(private firebase: admin.app.App, private prefix: string) {}

    public async upload(fileUrl: string, fileName: string): Promise<string> {
        const bucket = this.firebase.storage().bucket();

        const uploadedFileData = await bucket.upload(fileUrl, {
            destination: `${this.prefix}/${fileName}`,
            gzip: true,
            metadata: {
                cacheControl: 'public, max-age=31536000'
            }
        });
        const fileData = uploadedFileData[0];
        const config = {action: 'read', expires: this.EXPIRES};
        // @ts-ignore
        const [downloadUrl] = await fileData.getSignedUrl(config);
        return downloadUrl;
    }

    public async remove(imageUuid: string): Promise<void> {
        const bucket = this.firebase.storage().bucket();
        await bucket.deleteFiles({
            prefix: `${this.prefix}/${imageUuid}`
        });
    }
}
