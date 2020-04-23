import mongoose from 'mongoose';
import groupBy from 'ramda/src/groupBy';
import {Flat, FlatModel} from '../../db/models/flat';
import {LevelFlatLayout, LevelFlatLayoutModel} from '../../db/models/levelFlatLayout';
import {SinglePreviewImage} from '../../types/shared';

const groupByLevelLayout = groupBy((levelFlatLayout: LevelFlatLayout) => {
    return levelFlatLayout.levelLayout.id.toString();
});

export interface FlatInfo extends Flat {
    levelLayouts: FlatLevelLayouts[];
}

export interface FlatLevelLayouts {
    id: string;
    image: SinglePreviewImage;
    viewBox: {
        width: number;
        height: number;
    };
    paths: string[];
}

export const flatQuery = {
    getFlatSidebarInfo: async (parent, {flatId}) => {
        const flat = await FlatModel.findById(flatId)
            .populate({
                path: 'layout'
            })
            .populate({
                path: 'section'
            })
            .populate({
                path: 'level'
            })
            .populate({
                path: 'house',
                populate: {
                    path: 'apartmentComplex'
                }
            })
            .exec();
        if (!flat) {
            return null;
        }
        const flatObj = flat.toObject();
        flatObj.section = flatObj.section.sectionName as any;
        flatObj.level = flatObj.level.levelNumber as any;
        flatObj.apartmentComplex = flat.house.apartmentComplex;
        const layout = flat.layout;

        if (!layout) {
            return flatObj;
        }

        const levelFlatLayouts = await LevelFlatLayoutModel.find({
            flatLayout: mongoose.Types.ObjectId(layout.id)
        })
            .populate({
                path: 'levelLayout'
            })
            .exec();
        if (levelFlatLayouts && levelFlatLayouts.length > 0) {
            const newFlat: FlatInfo = flatObj as FlatInfo;
            const result = groupByLevelLayout(levelFlatLayouts);
            newFlat.levelLayouts = Object.keys(result).map((key) => {
                const item = result[key];
                const levelLayout = item[0].levelLayout;
                const viewBox = item[0].viewBox;
                const paths = item.map((flatLayout) => {
                    return String(flatLayout.path);
                });
                return {
                    id: levelLayout.id,
                    image: levelLayout.image,
                    viewBox,
                    paths
                };
            });
            return newFlat;
        }

        return flatObj;
    }
};
