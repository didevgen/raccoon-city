import {LevelLayoutModel} from '../../db/models/levelLayout';
import {LayoutImageService} from '../../services/image/layout';
import {S3ImageUploader} from '../../aws/s3ImageUploader';
import {LayoutDbService} from '../../db/services/layoutDbService';

export const levelMutation = {
    async assignLevelsToLayout(parent, {levelLayoutId, levels}) {
        await LevelLayoutModel.findOneAndUpdate(
            {
                _id: levelLayoutId
            },
            {
                $set: {
                    levels
                }
            }
        ).exec();
        return true;
    },
    async createLevelLayout(parent, args) {
        const {houseId, name, file} = args;
        if (houseId) {
            const layout = await LevelLayoutModel.create({
                name,
                house: houseId
            });
            await new LayoutImageService(
                new S3ImageUploader(houseId),
                new LayoutDbService(layout, LevelLayoutModel)
            ).addImage(await file);

            return layout;
        }

        return null;
    }
};
