import {S3ImageUploader} from '../../aws/s3ImageUploader';
import House from '../../db/models/house';
import {HouseLayoutModel} from '../../db/models/houseLayout';
import {HouseLayoutDbService} from '../../db/services/houseLayoutDbService';
import {LayoutImageService} from '../../services/image/layout';
import {Context} from '../../utils';

export const layoutMutation = {
    async createLayout(parent, args, ctx: Context) {
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
    }
};
