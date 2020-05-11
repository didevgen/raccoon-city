import mongoose from 'mongoose';
import {FileHistoryModel} from '../../db/models/fileHistory';

export const fileHistoryQuery = {
    async getHistory(_, {apartmentComplexId}) {
        const result = await FileHistoryModel.find({
            isDeleted: false,
            apartmentComplex: mongoose.Types.ObjectId(apartmentComplexId)
        })
            .sort({timestamp: -1})
            .exec();

        return result.map((item) => {
            const result = item.toObject();
            return {
                ...result,
                id: item.id,
                timestamp: result.timestamp.toISOString()
            };
        });
    }
};
