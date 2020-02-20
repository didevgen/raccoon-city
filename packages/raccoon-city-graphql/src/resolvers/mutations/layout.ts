import {S3ImageUploader} from '../../aws/s3ImageUploader';
import {FlatModel} from '../../db/models/flat';
import {HouseLayoutModel} from '../../db/models/houseLayout';
import {LayoutDbService} from '../../db/services/layoutDbService';
import {LayoutImageService} from '../../services/image/layout';
import {LevelLayoutModel} from '../../db/models/levelLayout';

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
                new LayoutDbService(layout, HouseLayoutModel)
            ).addImage(await file);

            return layout;
        }

        return null;
    },
    async assignFlatsToLayout(parent, {flats, layoutId}) {
        if (layoutId) {
            await FlatModel.update(
                {
                    _id: {$nin: flats},
                    layout: layoutId
                },
                {
                    $unset: {
                        layout: layoutId
                    }
                },
                {multi: true}
            );
            const updateFlats = FlatModel.update(
                {
                    _id: {$in: flats}
                },
                {
                    $set: {
                        layout: layoutId
                    }
                },
                {multi: true}
            );
            const updateLayout = HouseLayoutModel.findOneAndUpdate(
                {
                    _id: layoutId
                },
                {
                    $set: {
                        flats
                    }
                }
            ).exec();
            const [updatedLayout] = await Promise.all([updateLayout, updateFlats]);
            return updatedLayout;
        }

        return null;
    }
};
