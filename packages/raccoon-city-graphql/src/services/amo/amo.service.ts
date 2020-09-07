import axios from 'axios';
import {addDays} from 'date-fns';

export async function getAmoData(developerId, redis) {
    const data = await redis.get(`${developerId}-amo`);

    if (data) {
        return JSON.parse(data);
    }

    return null;
}

export async function sendAmoGetRequest(developerId, {path, params}, redis) {
    const amoConfig = await getAmoData(developerId, redis);

    if (!amoConfig) {
        return Promise.reject();
    }

    const accessToken = await getAcessToken(developerId, redis);

    if (!accessToken) {
        return Promise.reject();
    }

    return axios.get(`https://${amoConfig.domain}.amocrm.ru${path}`, {
        headers: {
            'User-Agent': 'amoCRM/oAuth Client 1.0',
            Authorization: `Bearer ${accessToken}`
        },
        params
    });
}

export async function sendAmoGetFullRequest(developerId, {url, params}, redis) {
    const amoConfig = await getAmoData(developerId, redis);

    if (!amoConfig) {
        return Promise.reject();
    }

    const accessToken = await getAcessToken(developerId, redis);

    if (!accessToken) {
        return Promise.reject();
    }

    return axios.get(url, {
        headers: {
            'User-Agent': 'amoCRM/oAuth Client 1.0',
            Authorization: `Bearer ${accessToken}`
        },
        params
    });
}
export async function getAcessToken(id, redis) {
    const [accessToken, refreshToken] = await Promise.all([redis.get(`${id}-access`), redis.get(`${id}-amo`)]);
    if (accessToken) {
        return accessToken;
    }

    if (!accessToken && refreshToken) {
        const amoConfig = JSON.parse(refreshToken);

        const {data} = await axios.post(
            `https://${amoConfig.domain}.amocrm.ru/oauth2/access_token`,
            {
                client_id: amoConfig.client_id,
                client_secret: amoConfig.client_secret,
                grant_type: 'refresh_token',
                refresh_token: amoConfig.refresh_token,
                redirect_uri: amoConfig.redirect_uri
            },
            {
                headers: {
                    'User-Agent': 'amoCRM/oAuth Client 1.0'
                }
            }
        );

        const {expires_in, access_token, refresh_token} = data;

        await Promise.all([
            redis.set(`${id}-access`, access_token, 'ex', expires_in),
            redis.set(
                `${id}-amo`,
                JSON.stringify({
                    refresh_token,
                    domain: amoConfig.domain,
                    client_id: amoConfig.client_id,
                    client_secret: amoConfig.client_secret,
                    redirect_uri: amoConfig.redirect_uri,
                    expires: addDays(new Date(), 90).toISOString()
                }),
                'ex',
                expires_in * 30 * 3
            )
        ]);

        return access_token;
    }

    return null;
}
