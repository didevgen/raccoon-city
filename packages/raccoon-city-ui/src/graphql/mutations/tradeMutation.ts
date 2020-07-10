import {gql} from 'apollo-boost';

export const CREATE_TRADE = gql`
    mutation createTrade($developerUuid: String!, $trade: TradeInput!) {
        createTrade(developerUuid: $developerUuid, trade: $trade) {
            id
        }
    }
`;

export const UPDATE_TRADE = gql`
    mutation updateTrade($uuid: String!, $trade: TradeInput!) {
        updateTrade(uuid: $uuid, trade: $trade) {
            id
        }
    }
`;

export const DELETE_TRADE = gql`
    mutation deleteTrade($uuid: String!) {
        deleteTrade(uuid: $uuid)
    }
`;
