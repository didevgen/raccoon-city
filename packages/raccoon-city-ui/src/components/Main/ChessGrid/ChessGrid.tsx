import {useQuery} from '@apollo/react-hooks';
import React, {Fragment, useEffect, useReducer, useState} from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import {useParams} from 'react-router-dom';
import {
    FlatsInHouse,
    GET_GROUPED_FLATS_CHESSGRID,
    GET_PUBLIC_GROUPED_FLATS_CHESSGRID,
    GET_PUBLIC_FLATS_LIST,
    GetGroupedFlatsBySectionQuery,
    GroupedFlats,
    GET_FLAT_LIST
} from '../../../graphql/queries/houseQuery';
import {setRouteParams, setTitle} from '../../../redux/actions';
import {Flat} from '../../shared/types/flat.types';
import {House} from '../../shared/types/house.types';
import {ChessGridColumn} from './ChessGridColumn/ChessGridColumn';
import {ChessGridFiltersDrawer, ShowFilter} from './ChessGridFiltersDrawer/ChessGridFiltersDrawer';
import {PublicLink} from './PublicLink/PublicLink';
import {ChessGridWrapper, ColumnWrapper, Container, ColumnTitle, SidebarDrawer, SelectStyled} from './ChessGrid.styled';
import {showMutedFlats} from './ChessGrid.utils';
import {getInitialState, reducer} from './ChessGrid.reducer';
import MenuItem from '@material-ui/core/MenuItem';
import {ChessListView} from './ChessListView/ChessListView';
import {ChessFloorView} from './ChessFloorView/ChessFloorView';
import {ChessCellViewMode, ViewModeValues} from './ChessEnums';
import {ChessSideBar} from './ChessSideBar';
import styled from 'styled-components';

export const ViewModeContext = React.createContext({selectedViewMode: ViewModeValues.AREA});
export const CellViewModeContext = React.createContext({mode: ChessCellViewMode.TILE});

export const CustomSidebarDrawer = styled(SidebarDrawer)`
    .MuiAppBar-colorPrimary {
        background-color: #e84f1d;
    }

    .PrivateTabIndicator-colorSecondary-42 {
        background-color: #fff;
    }
`;

const ChessGridContent = React.memo((props: any) => {
    const {
        filters,
        data,
        loading,
        listLoading,
        error,
        listError,
        hasSelect,
        isPublic,
        onFlatSelected,
        showRequestButton,
        listData
    } = props;

    const [flatCardOpen, setFlatCardOpen] = useState(false);
    const [selectedFlat, setSelectedFlat] = useState<Flat>();

    const SideBar = isPublic ? CustomSidebarDrawer : SidebarDrawer;

    if (loading || listLoading) {
        return <ChessGridWrapper>Loading</ChessGridWrapper>;
    }

    if (error || listError) {
        return <ChessGridWrapper>Error :(</ChessGridWrapper>;
    }

    if (!data || !listData) {
        return null;
    }

    const houseFlats: FlatsInHouse[] = data?.getGroupedFlatsBySection.houseFlats;
    const {getPublicFlatsList, getFlatsList} = listData;
    const listFlats: Flat[] = getFlatsList ? getFlatsList : getPublicFlatsList;

    const selectFlat = (flat: Flat) => {
        setSelectedFlat(flat);
        setFlatCardOpen(true);
    };

    if (filters.mode === ChessCellViewMode.FLOOR) {
        return (
            <Fragment>
                <ChessFloorView filters={filters} onSelect={selectFlat} houseFlats={houseFlats} isPublic={isPublic} />
                {flatCardOpen && (
                    <ChessSideBar
                        SideBar={SideBar}
                        selectedFlat={selectedFlat}
                        isPublic={isPublic}
                        showRequestButton={showRequestButton}
                        onFlatSelected={onFlatSelected}
                        setFlatCardOpen={setFlatCardOpen}
                        setSelectedFlat={setSelectedFlat}
                        flatCardOpen={flatCardOpen}
                    />
                )}
            </Fragment>
        );
    }

    if (filters.mode === ChessCellViewMode.LIST) {
        return (
            <Fragment>
                <ChessListView listData={listFlats} filters={filters} onSelect={selectFlat} />

                {flatCardOpen && (
                    <ChessSideBar
                        SideBar={SideBar}
                        selectedFlat={selectedFlat}
                        isPublic={isPublic}
                        showRequestButton={showRequestButton}
                        onFlatSelected={onFlatSelected}
                        setFlatCardOpen={setFlatCardOpen}
                        setSelectedFlat={setSelectedFlat}
                        flatCardOpen={flatCardOpen}
                    />
                )}
            </Fragment>
        );
    }

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
                            <ColumnTitle variant="h5" gutterBottom>
                                {group.name}
                            </ColumnTitle>
                            <ColumnWrapper>
                                {showMutedFlats(groupedFlats, filters).map((item: GroupedFlats) => {
                                    return (
                                        <ChessGridColumn
                                            key={item.id}
                                            columnName={item.section}
                                            levels={item.levels}
                                            onSelect={selectFlat}
                                        />
                                    );
                                })}
                            </ColumnWrapper>
                        </Container>
                    );
                })}

                {flatCardOpen && (
                    <ChessSideBar
                        SideBar={SideBar}
                        selectedFlat={selectedFlat}
                        isPublic={isPublic}
                        showRequestButton={showRequestButton}
                        onFlatSelected={onFlatSelected}
                        setFlatCardOpen={setFlatCardOpen}
                        setSelectedFlat={setSelectedFlat}
                        flatCardOpen={flatCardOpen}
                    />
                )}
            </ChessGridWrapper>
        </ViewModeContext.Provider>
    );
});

function FilterIcon({setShownFilters, id}) {
    const elem = document.getElementById(id);
    if (!elem) {
        return null;
    }
    return ReactDOM.createPortal(<ShowFilter setShownFilters={setShownFilters} />, elem);
}

export const ChessGridComponent = ({uuid, hasSelect, isPublic, showRequestButton, onFlatSelected, filterId}) => {
    const [isMounted, setMounted] = useState(false);
    const [filterShown, setShownFilters] = useState(!!hasSelect);
    const [id, setId] = useState(uuid ? [uuid] : []);
    const [filters, dispatch] = useReducer(reducer, getInitialState(isPublic));

    const QUERY = isPublic ? GET_PUBLIC_GROUPED_FLATS_CHESSGRID : GET_GROUPED_FLATS_CHESSGRID;
    const QUERY_LIST = isPublic ? GET_PUBLIC_FLATS_LIST : GET_FLAT_LIST;

    const {data, error, loading} = useQuery<GetGroupedFlatsBySectionQuery>(QUERY, {
        fetchPolicy: 'cache-and-network',
        variables: {
            uuid: id
        },
        skip: id.length === 0
    });

    const {data: listData, error: listError, loading: listLoading} = useQuery<any>(QUERY_LIST, {
        fetchPolicy: 'cache-and-network',
        variables: {
            uuid: id
        },
        skip: id.length === 0
    });

    useEffect(() => {
        setMounted(true);
    }, []);

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

    const changeChessView = (e) => {
        dispatch({type: 'cellViewMode', payload: e.target.value});
    };

    return (
        <Fragment>
            <CellViewModeContext.Provider value={filters}>
                <ChessGridFiltersDrawer
                    filterShown={filterShown}
                    setShownFilters={setShownFilters}
                    dispatchFn={dispatch}
                    data={id.length === 0 ? null : data}
                    onHouseChange={onHouseChange}
                    isPublic={isPublic}
                />
            </CellViewModeContext.Provider>

            <div>
                {!isPublic && <PublicLink />}
                <SelectStyled value={filters.mode} onChange={changeChessView}>
                    <MenuItem value={ChessCellViewMode.TILE}>Плитка</MenuItem>
                    <MenuItem value={ChessCellViewMode.TILE_PLUS}>Плитка+</MenuItem>
                    <MenuItem value={ChessCellViewMode.LIST}>Список</MenuItem>
                    <MenuItem value={ChessCellViewMode.FLOOR}>Этаж</MenuItem>
                </SelectStyled>
            </div>

            <CellViewModeContext.Provider value={filters}>
                <ChessGridContent
                    hasSelect={hasSelect}
                    filters={filters}
                    loading={loading}
                    listLoading={listLoading}
                    error={error}
                    listError={listError}
                    onFlatSelected={onFlatSelected}
                    isPublic={isPublic}
                    showRequestButton={showRequestButton}
                    data={id.length === 0 ? null : data}
                    listData={id.length === 0 ? null : listData}
                />
            </CellViewModeContext.Provider>

            {isMounted && <FilterIcon setShownFilters={setShownFilters} id={filterId} />}
        </Fragment>
    );
};

export const ChessGrid = connect(null, (dispatch) => ({
    applyParams: (params) => dispatch(setRouteParams(params)),
    applyTitle: (title) => dispatch(setTitle(title))
}))(({applyParams, hasSelect, applyTitle, isPublic, onFlatSelected, filterId, showRequestButton}) => {
    const params = useParams();
    const {houseUuid} = useParams();

    useEffect(() => {
        applyParams(params);
        applyTitle('Шахматка');
    }, [params]); // eslint-disable-line

    const filterBlockId = filterId || 'chessGridFilterContainer';

    return (
        <ChessGridComponent
            uuid={houseUuid}
            hasSelect={hasSelect}
            isPublic={isPublic}
            filterId={filterBlockId}
            showRequestButton={showRequestButton}
            onFlatSelected={onFlatSelected}
        />
    );
});

export default ChessGrid;
