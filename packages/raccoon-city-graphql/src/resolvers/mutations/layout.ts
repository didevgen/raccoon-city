import {S3ImageUploader} from '../../aws/s3ImageUploader';
import House from '../../db/models/house';
import {LandingImageDbService} from '../../db/services/images/landingImageDbService';
import {LayoutImageService} from '../../services/image/layout';
import {Context} from '../../utils';

export const layoutMutation = {
    async createLayout(parent, args, ctx: Context) {
        const houseId = args.houseId;
        const downloadUrl = new LayoutImageService(
            new S3ImageUploader(houseId),
            new LandingImageDbService(houseId, this.mode, House)
        ).addImage(await args.file);
        return null;
    }
};
