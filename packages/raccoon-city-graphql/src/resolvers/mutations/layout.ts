import {S3ImageUploader} from '../../aws/s3ImageUploader';
import {FlatModel} from '../../db/models/flat';
import {HouseLayoutModel} from '../../db/models/houseLayout';
import {LayoutDbService} from '../../db/services/layoutDbService';
import {LayoutImageService} from '../../services/image/layout';
import {Context} from '../../utils';
import {HouseImageServiceFactory} from '../../services/image/houseImageServiceFactory';
import {FlatLayoutImageServiceFactory} from '../../services/image/flatLayoutImageServiceFactory';

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
    async addFlatLayoutImage(parent, args, ctx: Context) {
        return new FlatLayoutImageServiceFactory(args.mode)
            .getImageService(args.uuid, args.name)
            .addImage(await args.file);
    },
    async deleteFlatLayoutImage(parent, args, ctx: Context) {
        await new FlatLayoutImageServiceFactory(args.mode).getImageService(args.uuid).removeImage(args.imageId);
        return 'Success';
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
