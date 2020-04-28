import {S3ImageUploader} from '../../aws/s3ImageUploader';
import {cities} from '../../constants/cities';
import {DeveloperModel} from '../../db/models/developer';
import {DataImageService} from '../../db/services/dataImageService';
import {PhotosService} from '../../services/image/photos';

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
    }
};
