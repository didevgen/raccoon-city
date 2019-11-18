import {Context} from "../../utils";
import {cities} from "../../constants/cities";
export const city = {
    cities: (vars, args, ctx: Context) => {
        return cities;
    }
};
