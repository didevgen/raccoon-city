import {S3ImageUploader} from '../../aws/s3ImageUploader';
import {DeveloperModel} from '../../db/models/developer';
import {DataImageService} from '../../db/services/dataImageService';
import {PhotosService} from '../../services/image/photos';
import axios from 'axios';
import {addDays} from 'date-fns';

class LogoDbService implements DataImageService {
    constructor(private developerId: string) {}

    public removeImage(imageUuid: string): Promise<void> {
        return undefined;
    }

    public async uploadImage(imageUuid: string, downloadUrl: string, previewUrl?: string): Promise<void> {
        await DeveloperModel.findOneAndUpdate(
            {
                _id: this.developerId,
                isDeleted: false
            },
            {
                $set: {
                    logo: {
                        uuid: imageUuid,
                        downloadUrl
                    }
                }
            }
        ).exec();
        return undefined;
    }
}

export const developerMutation = {
    async createDeveloper(_, {developerData, image}) {
        const developer = await DeveloperModel.create(developerData);

        if (image) {
            const id = developer.id;
            await new PhotosService(new S3ImageUploader(developer.id), new LogoDbService(id)).addImage(await image);
        }

        return developer;
    },
    async deleteDeveloper(_, {id}) {
        const developer = await DeveloperModel.findOneAndUpdate(
            {
                _id: id,
                isDeleted: false
            },
            {
                $set: {
                    isDeleted: true
                }
            }
        );
        return true;
    },
    async updateDeveloper(_, {id, developerData, image}) {
        const developer = await DeveloperModel.findOneAndUpdate(
            {
                _id: id,
                isDeleted: false
            },
            {
                $set: {
                    ...developerData
                }
            }
        );

        if (image) {
            await new PhotosService(new S3ImageUploader(developer.id), new LogoDbService(id)).addImage(await image);
        }

        return developer;
    },
    async configureAmo(_, {id, amoConfig}, {redis}) {
        try {
            const {data} = await axios.post(
                `https://${amoConfig.domain}.amocrm.ru/oauth2/access_token`,
                {
                    client_id: amoConfig.integrationId,
                    client_secret: amoConfig.secretKey,
                    grant_type: 'authorization_code',
                    code: amoConfig.authCode,
                    redirect_uri: amoConfig.redirectUrl
                },
                {
                    headers: {
                        'User-Agent': 'amoCRM/oAuth Client 1.0'
                    }
                }
            );
            const {expires_in, access_token, refresh_token} = data;
            await Promise.all([
                redis.set(`${id}-access`, access_token, 'ex', expires_in),
                redis.set(
                    `${id}-amo`,
                    JSON.stringify({
                        refresh_token,
                        domain: amoConfig.domain,
                        client_id: amoConfig.integrationId,
                        client_secret: amoConfig.secretKey,
                        redirect_uri: amoConfig.redirectUrl,
                        expires: addDays(new Date(), 90).toISOString()
                    }),
                    'ex',
                    expires_in * 30 * 3
                )
            ]);
            return true;
        } catch (e) {
            return false;
        }
    }
};
