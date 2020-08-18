import {useQuery} from '@apollo/react-hooks';
import React, {Fragment, useEffect, useReducer, useState} from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import {useParams} from 'react-router-dom';
import {
    FlatsInHouse,
    GET_GROUPED_FLATS_CHESSGRID,
    GET_PUBLIC_GROUPED_FLATS_CHESSGRID,
    GetGroupedFlatsBySectionQuery,
    GroupedFlats
} from '../../../graphql/queries/houseQuery';
import {setRouteParams, setTitle} from '../../../redux/actions';
import {Flat} from '../../shared/types/flat.types';
import {House} from '../../shared/types/house.types';
import {ChessGridColumn} from './ChessGridColumn/ChessGridColumn';
import {ChessGridFiltersDrawer, ShowFilter} from './ChessGridFiltersDrawer/ChessGridFiltersDrawer';
import FlatSidebarInfo from './FlatSidebarInfo/FlatSidebarInfo';
import {PublicLink} from './PublicLink/PublicLink';
import {ChessGridWrapper, ColumnWrapper, Container, ColumnTitle, SidebarDrawer} from './ChessGrid.styled';
import {showMutedFlats} from './ChessGrid.utils';
import {initialState, reducer} from './ChessGrid.reducer';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

export enum ViewModeValues {
    AREA = 'area',
    ROOM = 'roomAmount',
    NUMBER = 'flatNumber'
}

export enum ChessCellViewMode {
    TILE = 'tile',
    TILE_PLUS = 'tilePlus',
    LIST = 'list'
}

export const ViewModeContext = React.createContext({selectedViewMode: ViewModeValues.AREA});
export const CellViewModeContext = React.createContext({mode: 'tile'});

const ChessGridContent = React.memo(
    ({filters, data, loading, error, hasSelect, isPublic, onFlatSelected, showRequestButton}: any) => {
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
                                                onSelect={(flat: Flat) => {
                                                    setSelectedFlat(flat);
                                                    setFlatCardOpen(true);
                                                }}
                                            />
                                        );
                                    })}
                                </ColumnWrapper>
                            </Container>
                        );
                    })}

                    <SidebarDrawer
                        anchor="right"
                        open={flatCardOpen}
                        onOpen={() => {
                            // silence
                        }}
                        onClose={() => {
                            setFlatCardOpen(false);
                            setSelectedFlat(undefined);
                        }}
                    >
                        {selectedFlat && (
                            <FlatSidebarInfo
                                // @ts-ignore
                                flat={selectedFlat}
                                isPublic={isPublic}
                                showRequestButton={showRequestButton}
                                onFlatSelected={onFlatSelected}
                            />
                        )}
                    </SidebarDrawer>
                </ChessGridWrapper>
            </ViewModeContext.Provider>
        );
    }
);

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
    const [filters, dispatch] = useReducer(reducer, initialState);
    const [id, setId] = useState(uuid ? [uuid] : []);
    const QUERY = isPublic ? GET_PUBLIC_GROUPED_FLATS_CHESSGRID : GET_GROUPED_FLATS_CHESSGRID;
    const {data, error, loading} = useQuery<GetGroupedFlatsBySectionQuery>(QUERY, {
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
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={filters.mode}
                    onChange={changeChessView}
                >
                    <MenuItem value={ChessCellViewMode.TILE}>Плитка</MenuItem>
                    <MenuItem value={ChessCellViewMode.TILE_PLUS}>Плитка+</MenuItem>
                    <MenuItem value={ChessCellViewMode.LIST}>Список</MenuItem>
                </Select>
            </div>

            <CellViewModeContext.Provider value={filters}>
                <ChessGridContent
                    hasSelect={hasSelect}
                    filters={filters}
                    loading={loading}
                    error={error}
                    onFlatSelected={onFlatSelected}
                    isPublic={isPublic}
                    showRequestButton={showRequestButton}
                    data={id.length === 0 ? null : data}
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
