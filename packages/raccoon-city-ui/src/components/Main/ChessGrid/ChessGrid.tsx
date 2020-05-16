import {useQuery} from '@apollo/react-hooks';
import {Drawer, Typography} from '@material-ui/core';
import React, {Fragment, useEffect, useReducer, useState} from 'react';
import {connect} from 'react-redux';
import {useParams} from 'react-router-dom';
import styled from 'styled-components';
import {
    FlatsInHouse,
    GET_GROUPED_FLATS_CHESSGRID,
    GetGroupedFlatsBySectionQuery,
    GroupedFlats
} from '../../../graphql/queries/houseQuery';
import {setRouteParams, setTitle} from '../../../redux/actions';
import {Flat} from '../../shared/types/flat.types';
import {House} from '../../shared/types/house.types';
import {ChessGridColumn} from './ChessGridColumn/ChessGridColumn';
import {ChessGridFilters} from './ChessGridFilters/ChessGridFilters';
import {FlatSidebarInfo} from './FlatSidebarInfo/FlatSidebarInfo';

const ChessGridWrapper: any = styled.div`
    width: 100%;
    overflow-y: scroll;
    margin-top: ${(p: any) => (p.hasSelect ? '170px' : '64px')};
    background-color: #fff;
    display: flex;
    flex-direction: row;
`;

const ColumnWrapper = styled.div`
    display: flex;
    flex-direction: row;
`;

const Container = styled.div`
    padding: 0 16px;
    border-right: 1px solid #cccccc;
    display: flex;
    flex-direction: column;
    align-self: flex-end;
`;

const ColumnTitle = styled(Typography)`
    text-align: center;
`;

export enum ViewModeValues {
    AREA = 'area',
    ROOM = 'roomAmount',
    NUMBER = 'flatNumber'
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

function ChessGridContent({filters, data, loading, error, hasSelect}) {
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

    const houseFlats: FlatsInHouse[] = data?.getGroupedFlatsBySection.houseFlats;

    return (
        <ViewModeContext.Provider value={filters}>
            <ChessGridWrapper hasSelect={hasSelect}>
                {houseFlats.map((group: FlatsInHouse) => {
                    const {groupedFlats} = group;

                    if (!groupedFlats || (groupedFlats && groupedFlats.length === 0)) {
                        return null;
                    }

                    return (
                        <Container key={group.id}>
                            <ColumnWrapper>
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
                            </ColumnWrapper>
                            <ColumnTitle variant="h5" gutterBottom>
                                {group.name}
                            </ColumnTitle>
                        </Container>
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
    const [id, setId] = useState(uuid ? [uuid] : []);
    const {data, error, loading} = useQuery<GetGroupedFlatsBySectionQuery>(GET_GROUPED_FLATS_CHESSGRID, {
        fetchPolicy: 'cache-and-network',
        variables: {
            uuid: id
        },
        skip: id.length === 0
    });

    let onHouseChange;
    if (hasSelect) {
        onHouseChange = async (houses: House[]) => {
            if (houses) {
                setId(houses.map((h) => h.id));
            } else {
                setId([]);
            }
        };
    }

    return (
        <Fragment>
            <ChessGridFilters
                dispatchFn={dispatch}
                data={id.length === 0 ? null : data}
                onHouseChange={onHouseChange}
            />
            <ChessGridContent
                hasSelect={hasSelect}
                filters={filters}
                loading={loading}
                error={error}
                data={id.length === 0 ? null : data}
            />
        </Fragment>
    );
};

export const ChessGrid = connect(null, (dispatch) => ({
    applyParams: (params) => dispatch(setRouteParams(params)),
    applyTitle: (title) => dispatch(setTitle(title))
}))(({applyParams, hasSelect, applyTitle}) => {
    const params = useParams();
    const {houseUuid} = useParams();

    useEffect(() => {
        applyParams(params);
        applyTitle('Шахматка');
    }, [params]); // eslint-disable-line

    return <ChessGridComponent uuid={houseUuid} hasSelect={hasSelect} />;
});
