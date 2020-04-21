import {S3ImageUploader} from '../../aws/s3ImageUploader';
import {LevelFlatLayoutModel} from '../../db/models/levelFlatLayout';
import {LevelLayoutModel} from '../../db/models/levelLayout';
import {LayoutDbService} from '../../db/services/layoutDbService';
import {LayoutImageService} from '../../services/image/layout';

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
                _id: layoutAssignmentId
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
                _id: layoutAssignmentId
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
        await LevelFlatLayoutModel.deleteOne({
            _id: layoutAssignmentId
        });
        return true;
    }
};
