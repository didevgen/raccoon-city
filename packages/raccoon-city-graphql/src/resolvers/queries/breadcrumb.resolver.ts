import {DeveloperModel} from "../../db/models/developer";
import ApartmentComplexModel from "../../db/models/apartmentComplex";
import HouseModel from "../../db/models/house";
import {HouseLayoutModel} from "../../db/models/houseLayout";

export const breadcrumbQuery = {
    async getBreadcrumbs(_, {args}) {
        const {developerUuid, apartmentComplexUuid, houseUuid, layoutId} = args;
        const result = [];
        const requests = [];
        let currentUrl = '/developers';
        if (developerUuid) {
            requests.push(DeveloperModel.findById(developerUuid).exec());
            currentUrl = `${currentUrl}/${developerUuid}`;
            result.push({
                url: `${currentUrl}/apartmentComplexes`
            })
        }

        if (apartmentComplexUuid) {
            requests.push(ApartmentComplexModel.findById(apartmentComplexUuid).exec());
            currentUrl = `${currentUrl}/apartmentComplex/${apartmentComplexUuid}`;
            result.push({
                url: `${currentUrl}/overview/info`
            })
        }

        if (houseUuid) {
            requests.push(HouseModel.findById(houseUuid).exec());
            currentUrl = `${currentUrl}/house/${houseUuid}`;
            result.push({
                url: currentUrl
            })
        }

        if (layoutId) {
            requests.push(HouseLayoutModel.findById(layoutId).exec());
            currentUrl = `${currentUrl}/layout/${layoutId}`;
            result.push({
                url: currentUrl
            })
        }

        const items = await Promise.all(requests);
        result.forEach((item, i) => {
            item.name = items[i].name
        });

        return result;
    }
}
