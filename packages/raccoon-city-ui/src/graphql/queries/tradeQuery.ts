import {gql} from 'apollo-boost';

export const ALL_TRADES = gql`
    query getAllTrades($developerUuid: String!) {
        getAllTrades(developerUuid: $developerUuid) {
            id
            tradeNumber
            state
            budget
            leadStatus
            clientInterests
            link
            visitDate
            nextVisitDate
            paymentType
            tradeSource
            paymentProvider
            price
            propertyType
            responsible {
                id
                name
            }
            flat {
                flatId
                flatNumber
                section
                level
                apartmentComplexId
                apartmentComplex
                house
                houseId
            }
            contact {
                id
                name
                phones
                email
                position
            }
        }
    }
`;

export const GET_TRADE = gql`
    query getTrade($uuid: String!) {
        getTrade(uuid: $uuid) {
            id
            tradeNumber
            state
            budget
            leadStatus
            clientInterests
            link
            visitDate
            nextVisitDate
            paymentType
            paymentProvider
            price
            tradeSource
            propertyType
            responsible {
                id
                name
            }
            flat {
                flatId
                flatNumber
                section
                level
                apartmentComplexId
                apartmentComplex
                house
                houseId
            }
            contact {
                id
                name
                phones
                email
                position
            }
        }
    }
`;

export const APPROPRIATE_TRADES = gql`
    query getTradesForAppropriateContact($contactId: String!) {
        getTradesForAppropriateContact(contactId: $contactId) {
            id
            tradeNumber
        }
    }
`;

export const GET_TRADE_DROPDOWNS = gql`
    query getTradeDropdowns {
        tradeStates {
            key
            displayName
            color
        }
        tradeSources {
            key
            displayName
        }
        leadStatuses {
            key
            displayName
        }
        clientInterests {
            key
            displayName
        }
        propertyTypes {
            key
            displayName
        }
        paymentTypes {
            key
            displayName
        }
        paymentProviders {
            key
            displayName
        }
        clientStatuses {
            key
            displayName
        }
        clientSources {
            key
            displayName
        }
    }
`;
