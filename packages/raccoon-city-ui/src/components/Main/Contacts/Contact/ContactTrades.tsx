import React, {useEffect, useRef, useReducer} from 'react';
import {useQuery, useMutation} from '@apollo/react-hooks';
import {Field} from 'react-final-form';
import {GET_TRADE_DROPDOWNS} from '../../../../graphql/queries/tradeQuery';
import {APPROPRIATE_TRADES} from '../../../../graphql/queries/tradeQuery';
import {AddTradeButton} from '../../../shared/components/addTradeButton/AddTradeButton';
import Trade from '../../Trades/Trade/Trade';
import {ContactInterface} from '../../../shared/types/contact.type';
import {DELETE_TRADE} from '../../../../graphql/mutations/tradeMutation';
import {RootContainer, TradesContainer, SearchContainer} from './ContactForm.styled';
import {Grid, TextField} from '@material-ui/core';
import {getConstant, getAppropriateItems, searchTradesHelper} from './ContactTradesUtils';
import useDebounce from '../../../../hooks/useDebaunce';
import {LoadedTrades} from './LoadedTrades';
import {SearchedTrades} from './SearchedTrades';

interface ContactTradesProps {
    contact: ContactInterface;
}

export const itemsToLoad = 1;

const initialState = {
    isTradeOpen: false,
    tradeUuid: '',
    loadedItems: [],
    start: 0,
    stop: itemsToLoad - 1,
    search: '',
    prevSearch: '',
    searchResult: []
};

interface Action {
    type: string;
    payload: any;
}

const reducer = (state, action: Action) => {
    switch (action.type) {
        case 'setTradeOpen':
            return {...state, isTradeOpen: action.payload};
        case 'setLoadedItems':
            return {...state, loadedItems: action.payload};
        case 'setStart':
            return {...state, start: action.payload};
        case 'setStop':
            return {...state, stop: action.payload};
        case 'setSearch':
            return {...state, search: action.payload};
        case 'setPrevSearch':
            return {...state, prevSearch: action.payload};
        case 'setSearchResult':
            return {...state, searchResult: action.payload};
        default:
            throw new Error();
    }
};

const ContactTrades = (props: ContactTradesProps) => {
    const {contact} = props;
    const {id} = contact;
    //@ts-ignore
    const [state, dispatch] = useReducer(reducer, initialState);

    const {data: dropdowns, loading: dropdownsLoading} = useQuery(GET_TRADE_DROPDOWNS);
    const {data: trades, loading: isLoadingTrade} = useQuery(APPROPRIATE_TRADES, {
        variables: {
            contactId: id
        }
    });

    const [deleteTrade] = useMutation(DELETE_TRADE, {
        refetchQueries: [
            {
                query: APPROPRIATE_TRADES,
                variables: {
                    contactId: id
                }
            }
        ]
    });

    const editTrade = (id: string) => {
        dispatch({type: 'setTradeUuid', payload: id});
        dispatch({type: 'setTradeOpen', payload: true});
    };

    const debouncedGetSearchResult = useDebounce(getSearchResult, 700);

    const checkMountingRef = useRef<any>();

    useEffect(() => {
        if (state.search && state.search !== state.prevSearch) {
            debouncedGetSearchResult(state.search);
        }
    }, [state.search, state.prevSearch]);

    if (dropdownsLoading || isLoadingTrade) {
        return <div>Loading</div>;
    }

    const tradesToShow: any[] = trades.getContactTrades;

    function getNewItems() {
        const filteredItems = getAppropriateItems(tradesToShow, state.start, state.stop);

        const newItems: any = [...state.loadedItems, ...filteredItems];

        dispatch({type: 'setLoadedItems', payload: newItems});
    }

    function loadMore() {
        getNewItems();
        dispatch({type: 'setStart', payload: state.start + itemsToLoad});
        dispatch({type: 'setStop', payload: state.stop + itemsToLoad});
    }

    function getSearchResult(toSearch) {
        dispatch({type: 'setPrevSearch', payload: toSearch});

        const result = tradesToShow.filter((item) => {
            const stringToCompare = getConstant(dropdowns, item.leadStatus, 'leadStatuses');

            const tradeItems = [
                stringToCompare,
                item.flat.apartmentComplex,
                item.flat.house,
                item.tradeNumber,
                item.flat.flatNumber
            ];

            return searchTradesHelper(tradeItems, toSearch);
        });

        dispatch({type: 'setSearchResult', payload: result});
    }

    if (state.start === 0 && checkMountingRef.current) {
        loadMore();
    }

    return (
        <RootContainer>
            <div onClick={() => dispatch({type: 'setTradeOpen', payload: true})}>
                <AddTradeButton />
            </div>
            <SearchContainer>
                <Grid item xs={12}>
                    <Field name="search">
                        {(props) => {
                            return (
                                <TextField
                                    name="search"
                                    value={state.search}
                                    onChange={(e) =>
                                        dispatch({
                                            type: 'setSearch',
                                            payload: e.target.value
                                        })
                                    }
                                    fullWidth
                                    label="Поиск"
                                    variant="outlined"
                                />
                            );
                        }}
                    </Field>
                </Grid>
            </SearchContainer>
            <TradesContainer ref={checkMountingRef}>
                {state.search.length === 0 ? (
                    <LoadedTrades
                        loadedItems={state.loadedItems}
                        dropdowns={dropdowns}
                        tradesToShow={tradesToShow}
                        editTrade={editTrade}
                        deleteTrade={deleteTrade}
                        loadMore={loadMore}
                        stop={state.stop}
                    />
                ) : (
                    <SearchedTrades
                        searchResult={state.searchResult}
                        dropdowns={dropdowns}
                        editTrade={editTrade}
                        deleteTrade={deleteTrade}
                    />
                )}
            </TradesContainer>
            <Trade
                open={state.isTradeOpen}
                uuid={state.tradeUuid}
                contact={contact}
                handleClose={() => {
                    dispatch({type: 'setTradeUuid', payload: null});
                    dispatch({type: 'setTradeOpen', payload: false});
                }}
            />
        </RootContainer>
    );
};

export default ContactTrades;
