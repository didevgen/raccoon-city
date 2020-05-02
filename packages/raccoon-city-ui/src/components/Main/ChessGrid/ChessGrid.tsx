import {useApolloClient, useQuery} from '@apollo/react-hooks';
import {Drawer} from '@material-ui/core';
import React, {Fragment, useEffect, useReducer, useState} from 'react';
import {connect} from 'react-redux';
import {useParams} from 'react-router-dom';
import styled from 'styled-components';
import {
    GET_GROUPED_FLATS_CHESSGRID,
    GetGroupedFlatsBySectionQuery,
    GroupedFlats
} from '../../../graphql/queries/houseQuery';
import {setRouteParams} from '../../../redux/actions';
import {Flat} from '../../shared/types/flat.types';
import {House} from '../../shared/types/house.types';
import {ChessGridColumn} from './ChessGridColumn/ChessGridColumn';
import {ChessGridFilters, EmptyChessGridFilters} from './ChessGridFilters/ChessGridFilters';
import {FlatSidebarInfo} from './FlatSidebarInfo/FlatSidebarInfo';

const ChessGridWrapper = styled.div`
    width: 100%;
    overflow-y: scroll;
    background-color: #fff;
    display: flex;
    flex-direction: row;
    margin-top: 80px;
`;

export enum ViewModeValues {
    AREA = 'area',
    ROOM = 'room'
}

export const ViewModeContext = React.createContext({selectedViewMode: ViewModeValues.AREA});

const initialState = {
    selectedViewMode: ViewModeValues.AREA,
    selectedRoomAmount: {},
    price: {
        minPrice: 0,
        maxPrice: 0
    },
    area: {
        minArea: 0,
        maxArea: 0
    }
};

function reducer(state, action) {
    switch (action.type) {
        case 'mode':
            return {...state, selectedViewMode: action.payload};
        case 'roomAmount':
            return {...state, selectedRoomAmount: action.payload};
        case 'price':
            return {...state, price: action.payload};
        case 'area':
            return {...state, area: action.payload};
        case 'minMaxInit':
            return {...state, area: action.payload.area, price: action.payload.price};
        default:
            throw new Error();
    }
}

function checkRoomAmount(flat, selectedRoomAmount) {
    if (!!selectedRoomAmount && Object.values(selectedRoomAmount).some((value) => !!value)) {
        return (
            selectedRoomAmount[flat.roomAmount] === true || (selectedRoomAmount['4+'] && Number(flat.roomAmount) >= 4)
        );
    }

    return true;
}

function checkPrice(flat: Flat, price) {
    return price.minPrice <= flat.price && flat.price <= price.maxPrice;
}

function checkArea(flat: Flat, price) {
    return price.minArea <= flat.area && flat.area <= price.maxArea;
}

function isActive(flat: Flat, filters) {
    return (
        checkRoomAmount(flat, filters.selectedRoomAmount) &&
        checkPrice(flat, filters.price) &&
        checkArea(flat, filters.area)
    );
}

function showMutedFlats(items, filters) {
    items.forEach((section: GroupedFlats) => {
        section.levels.forEach((level) => {
            level.flats.forEach((flat) => {
                flat.isActive = isActive(flat, filters);
            });
        });
    });
    return items;
}

function ChessGridContent({filters, data, loading, error}) {
    const [flatCardOpen, setFlatCardOpen] = useState(false);
    const [selectedFlat, setSelectedFlat] = useState<Flat>();
    if (loading) {
        return <ChessGridWrapper>Loading</ChessGridWrapper>;
    }

    if (error) {
        return <ChessGridWrapper>Error :(</ChessGridWrapper>;
    }

    if (!data) {
        return null;
    }

    const {groupedFlats} = data?.getGroupedFlatsBySection;

    if (!groupedFlats || (groupedFlats && groupedFlats.length === 0)) {
        return <ChessGridWrapper>В данном доме еще нет квартир</ChessGridWrapper>;
    }

    return (
        <ViewModeContext.Provider value={filters}>
            <ChessGridWrapper>
                {showMutedFlats(groupedFlats, filters).map((item: GroupedFlats) => {
                    return (
                        <ChessGridColumn
                            key={item.id}
                            columnName={item.section}
                            levels={item.levels}
                            onSelect={(flat: Flat) => {
                                setSelectedFlat(flat);
                                setFlatCardOpen(true);
                            }}
                        />
                    );
                })}
                <Drawer
                    anchor="right"
                    open={flatCardOpen}
                    onClose={() => {
                        setFlatCardOpen(false);
                        setSelectedFlat(undefined);
                    }}
                >
                    {selectedFlat && <FlatSidebarInfo flat={selectedFlat} />}
                </Drawer>
            </ChessGridWrapper>
        </ViewModeContext.Provider>
    );
}

export const ChessGridComponent = ({uuid, hasSelect}) => {
    const [filters, dispatch] = useReducer(reducer, initialState);
    const [id, setId] = useState(uuid);
    const {data, error, loading} = useQuery(GET_GROUPED_FLATS_CHESSGRID, {
        variables: {
            uuid: id
        },
        skip: !id
    });

    let onHouseChange;
    if (hasSelect) {
        onHouseChange = async (house: House) => {
            if (house) {
                setId(house.id);
            }
        };
    }

    return (
        <Fragment>
            <ChessGridFilters dispatchFn={dispatch} data={data} onHouseChange={onHouseChange} />
            <ChessGridContent filters={filters} loading={loading} error={error} data={data} />
        </Fragment>
    );
};

export const ChessGrid = connect(null, (dispatch) => ({
    applyParams: (params) => dispatch(setRouteParams(params))
}))(({applyParams, hasSelect}) => {
    const params = useParams();
    const {houseUuid} = useParams();

    useEffect(() => {
        applyParams(params);
    }, [applyParams, params]);

    return <ChessGridComponent uuid={houseUuid} hasSelect={hasSelect} />;
});
