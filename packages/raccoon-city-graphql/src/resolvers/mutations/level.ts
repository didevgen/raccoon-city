import mongoose from 'mongoose';
import {S3ImageUploader} from '../../aws/s3ImageUploader';
import {LevelFlatLayoutModel} from '../../db/models/levelFlatLayout';
import {LevelLayoutModel} from '../../db/models/levelLayout';
import {LayoutDbService} from '../../db/services/layoutDbService';
import {LayoutImageService} from '../../services/image/layout';
import {Context} from '../../utils';

export const levelMutation = {
    async assignLevelsToLayout(parent, {levelLayoutId, levels}) {
        await LevelLayoutModel.findOneAndUpdate(
            {
                _id: levelLayoutId,
                isDeleted: false
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
    },
    async editLevelLayout(parent, args) {
        const {uuid, name, file} = args;
        if (uuid) {
            const layout = await LevelLayoutModel.findOneAndUpdate(
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
                    new LayoutDbService(layout, LevelLayoutModel)
                ).addImage(await file);
                await LevelFlatLayoutModel.updateMany(
                    {
                        levelLayout: mongoose.Types.ObjectId(uuid)
                    },
                    {
                        $set: {
                            isDeleted: true
                        }
                    }
                ).exec();
            }

            return layout;
        }

        return null;
    },
    async deleteLevelLayout(parent, {uuid}, ctx: Context) {
        await LevelLayoutModel.findOneAndUpdate({_id: uuid}, {$set: {isDeleted: true}}).exec();
        return true;
    },
    async assignFlatLayoutsToLevel(_, {levelLayoutId, flatLayoutId, path, viewBox}) {
        await LevelFlatLayoutModel.create({
            levelLayout: levelLayoutId,
            flatLayout: flatLayoutId,
            path,
            viewBox
        });
        return true;
    },
    async assignFlatLayoutsToLevelLayout(_, {layoutAssignmentId, flatLayoutId}) {
        await LevelFlatLayoutModel.findOneAndUpdate(
            {
                _id: layoutAssignmentId,
                isDeleted: false
            },
            {
                $set: {
                    flatLayout: flatLayoutId
                }
            }
        );
        return true;
    },
    async unassignFlatLayoutsToLevelLayout(_, {layoutAssignmentId}) {
        await LevelFlatLayoutModel.findOneAndUpdate(
            {
                _id: layoutAssignmentId,
                isDeleted: false
            },
            {
                $unset: {
                    flatLayout: ''
                }
            }
        );
        return true;
    },
    async deleteFlatLayoutsToLevelLayout(_, {layoutAssignmentId}) {
        await LevelFlatLayoutModel.updateOne(
            {
                _id: layoutAssignmentId
            },
            {
                $set: {
                    isDeleted: true
                }
            }
        );
        return true;
    }
};
