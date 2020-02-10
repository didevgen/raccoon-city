import {S3ImageUploader} from '../../aws/s3ImageUploader';
import {HouseLayoutModel} from '../../db/models/houseLayout';
import {HouseLayoutDbService} from '../../db/services/houseLayoutDbService';
import {LayoutImageService} from '../../services/image/layout';

export const layoutMutation = {
    async createLayout(parent, args) {
        const {houseId, name, file} = args;
        if (houseId) {
            const layout = await HouseLayoutModel.create({
                name,
                house: houseId
            });
            await new LayoutImageService(
                new S3ImageUploader(houseId),
                new HouseLayoutDbService(layout, HouseLayoutModel)
            ).addImage(await file);

            return layout;
        }

        return null;
    },
    async assignFlatsToLayout(parent, {flats, layoutId}) {
        if (layoutId) {
            return await HouseLayoutModel.findOneAndUpdate(
                {
                    _id: layoutId
                },
                {
                    $set: {
                        flats
                    }
                }
            ).exec();
        }

        return null;
    }
};
