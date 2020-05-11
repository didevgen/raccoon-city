import mongoose, {mongo} from 'mongoose';
import {S3ImageUploader} from '../../aws/s3ImageUploader';
import {FlatModel} from '../../db/models/flat';
import {HouseLayoutModel} from '../../db/models/houseLayout';
import {LayoutDbService} from '../../db/services/layoutDbService';
import {FlatLayoutImageServiceFactory} from '../../services/image/flatLayoutImageServiceFactory';
import {LayoutImageService} from '../../services/image/layout';
import {Context} from '../../utils';

export const layoutMutation = {
    async createLayout(parent, args) {
        const {houseId, name, file} = args;
        if (houseId) {
            const layout = await HouseLayoutModel.create({
                name,
                house: houseId
            });
            await new LayoutImageService(
                new S3ImageUploader(layout.id),
                new LayoutDbService(layout, HouseLayoutModel)
            ).addImage(await file);

            return layout;
        }

        return null;
    },
    async editLayout(parent, args) {
        const {uuid, name, file} = args;
        if (uuid) {
            const layout = await HouseLayoutModel.findOneAndUpdate(
                {
                    _id: mongoose.Types.ObjectId(uuid)
                },
                {
                    $set: {
                        name
                    }
                }
            );

            if (file) {
                await new LayoutImageService(
                    new S3ImageUploader(uuid),
                    new LayoutDbService(layout, HouseLayoutModel)
                ).addImage(await file);
            }

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
    async deleteFlatLayout(parent, {uuid}, ctx: Context) {
        await HouseLayoutModel.findOneAndUpdate({_id: uuid}, {$set: {isDeleted: true}}).exec();
        return true;
    },
    async assignFlatsToLayout(parent, {flats, layoutId}) {
        if (layoutId) {
            await FlatModel.update(
                {
                    _id: {$nin: flats},
                    isDeleted: false,
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
                    _id: {$in: flats},
                    isDeleted: false
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
                    _id: layoutId,
                    isDeleted: false
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
