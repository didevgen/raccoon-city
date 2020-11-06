import {useQuery} from '@apollo/react-hooks';
import React, {Fragment, useEffect, useReducer, useState} from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import {useParams} from 'react-router-dom';
import styled from 'styled-components';
import {
    FlatsInHouse,
    GET_FLAT_LIST,
    GET_GROUPED_FLATS_CHESSGRID,
    GET_PUBLIC_FLATS_LIST,
    GET_PUBLIC_GROUPED_FLATS_CHESSGRID,
    GetGroupedFlatsBySectionQuery,
    GroupedFlats
} from '../../../graphql/queries/houseQuery';
import {setRouteParams, setTitle} from '../../../redux/actions';
import {Flat} from '../../shared/types/flat.types';
import {House} from '../../shared/types/house.types';
import {ChessCellViewMode, ViewModeValues} from './ChessEnums';
import {ChessFloorView} from './ChessFloorView/ChessFloorView';
import {getInitialState, reducer} from './ChessGrid.reducer';
import {
    ChessGridWrapper,
    ColumnAndSectionBarWrapper,
    ColumnWrapper,
    Container,
    InfoIcon,
    MobileInformation,
    SidebarDrawer
} from './ChessGrid.styled';
import {showMutedFlats} from './ChessGrid.utils';
import {ChessGridAnimation} from './ChessGridAnimation/ChessGridAnimation';
import {ChessGridColumn} from './ChessGridColumn/ChessGridColumn';
import {ChessGridFiltersDrawer, ShowFilter} from './ChessGridFiltersDrawer/ChessGridFiltersDrawer';
import {ChessListView} from './ChessListView/ChessListView';
import {ChessSideBar} from './ChessSideBar';
import {FlatStatusesBar} from './FlatStatusesBar';
import {PublicLink} from './PublicLink/PublicLink';
import {SectionBar} from './SectionBar/SectionBar';

export const ViewModeContext = React.createContext({selectedViewMode: ViewModeValues.AREA});
export const CellViewModeContext = React.createContext({mode: ChessCellViewMode.TILE});

export const CustomSidebarDrawer = styled<any>(SidebarDrawer)`
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
        listData,
        houseId,
        setSavedFlat,
        savedFlat
    } = props;

    const [flatCardOpen, setFlatCardOpen] = useState(false);
    const [isSideBarOpen, setSideBarOpen] = useState(false);
    const [selectedFlat, setSelectedFlat] = useState<Flat>();
    const [currentLevel, setCurrentLevel] = useState<string>();

    const SideBar = isPublic ? CustomSidebarDrawer : SidebarDrawer;

    if (loading || listLoading) {
        return <ChessGridAnimation />;
    }

    if (error || listError) {
        return <ChessGridWrapper>Error :(</ChessGridWrapper>;
    }

    if (!data || !listData) {
        return null;
    }

    const houseFlats: FlatsInHouse[] = data?.getGroupedFlatsBySection.houseFlats;

    if (!houseFlats || houseFlats.length === 0) {
        return null;
    }

    const {getPublicFlatsList, getFlatsList} = listData;
    const listFlats: Flat[] = getFlatsList ? getFlatsList : getPublicFlatsList;

    const selectFlat = (flat: Flat) => {
        setSelectedFlat(flat);
        setFlatCardOpen(true);
    };

    // TODO divide to views component
    const tileView = (
        <ChessGridWrapper hasSelect={hasSelect}>
            {houseFlats.map((group: FlatsInHouse) => {
                const {groupedFlats} = group;

                if (!groupedFlats || (groupedFlats && groupedFlats.length === 0)) {
                    return null;
                }

                return (
                    <Container key={group.id}>
                        <ColumnAndSectionBarWrapper>
                            <ColumnWrapper>
                                {showMutedFlats(groupedFlats, filters).map((item: GroupedFlats) => {
                                    return (
                                        <ChessGridColumn
                                            key={item.id}
                                            columnName={item.section}
                                            levels={item.levels}
                                            onSelect={selectFlat}
                                            savedFlat={savedFlat}
                                        />
                                    );
                                })}
                            </ColumnWrapper>
                            {isPublic && filters.mode === ChessCellViewMode.TILE && (
                                <SectionBar isSideBarOpen={isSideBarOpen} setSideBarOpen={setSideBarOpen} />
                            )}
                        </ColumnAndSectionBarWrapper>
                    </Container>
                );
            })}
        </ChessGridWrapper>
    );

    // TODO divide to views component
    const chessViews = {
        [ChessCellViewMode.FLOOR]: (
            <ChessFloorView
                setCurrentLevel={setCurrentLevel}
                filters={filters}
                onSelect={selectFlat}
                houseFlats={houseFlats}
                isPublic={isPublic}
            />
        ),
        [ChessCellViewMode.LIST]: <ChessListView listData={listFlats} filters={filters} onSelect={selectFlat} />,
        [ChessCellViewMode.TILE]: tileView,
        [ChessCellViewMode.TILE_PLUS]: tileView
    };

    return (
        <ViewModeContext.Provider value={filters}>
            <MobileInformation>
                <FlatStatusesBar houseId={houseId} />
                <InfoIcon onClick={() => setSideBarOpen(true)} />
            </MobileInformation>

            {chessViews[filters.mode]}

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
                    houseId={houseId}
                    setSavedFlat={setSavedFlat}
                    viewMode={filters.mode}
                    currentLevel={currentLevel}
                />
            )}
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
    // TODO rename id to ids or something like this
    const [id, setId] = useState(uuid ? [uuid] : []);
    const [filters, dispatch] = useReducer(reducer, getInitialState(isPublic));
    const [savedFlat, setSavedFlat] = useState();

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

    return (
        <Fragment>
            <div>
                <h1>ЖК Хрущёвский Дом №1 Секция 4</h1>
            </div>

            <CellViewModeContext.Provider value={filters}>
                <ChessGridFiltersDrawer
                    filters={filters}
                    filterShown={filterShown}
                    setShownFilters={setShownFilters}
                    dispatchFn={dispatch}
                    data={id.length === 0 ? null : data}
                    onHouseChange={onHouseChange}
                    isPublic={isPublic}
                    houseId={id}
                />
            </CellViewModeContext.Provider>

            <div>{!isPublic && <PublicLink />}</div>

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
                    houseId={id}
                    setSavedFlat={setSavedFlat}
                    savedFlat={savedFlat}
                />
            </CellViewModeContext.Provider>

            {isMounted && <FilterIcon setShownFilters={setShownFilters} id={filterId} />}
        </Fragment>
    );
};

const ChessGrid = connect(null, (dispatch) => ({
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
