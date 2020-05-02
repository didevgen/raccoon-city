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
        const flat = await FlatModel.findOne({_id: flatId, isDeleted: false})
            .populate({
                path: 'layout',
                match: {isDeleted: false}
            })
            .populate({
                path: 'section',
                match: {isDeleted: false}
            })
            .populate({
                path: 'level',
                match: {isDeleted: false}
            })
            .populate({
                path: 'house',
                match: {isDeleted: false},
                populate: {
                    path: 'apartmentComplex',
                    match: {isDeleted: false},
                    populate: {
                        path: 'developer',
                        match: {isDeleted: false}
                    }
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
        flatObj.developer = flatObj.apartmentComplex.developer;
        const layout = flat.layout;

        if (!layout) {
            return flatObj;
        }

        const levelFlatLayouts = await LevelFlatLayoutModel.find({
            isDeleted: false,
            flatLayout: mongoose.Types.ObjectId(layout.id)
        })
            .populate({
                path: 'levelLayout',
                match: {isDeleted: false}
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
