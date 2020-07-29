import React, {useState, useEffect} from 'react';
import {useQuery, useMutation} from '@apollo/react-hooks';
import {Waypoint} from 'react-waypoint';
import {Field} from 'react-final-form';
import {GET_TRADE_DROPDOWNS} from '../../../../graphql/queries/tradeQuery';
import {APPROPRIATE_TRADES} from '../../../../graphql/queries/tradeQuery';
import {AddTradeButton} from '../../../shared/components/addTradeButton/AddTradeButton';
import Trade from '../../Trades/Trade/Trade';
import {ContactInterface} from '../../../shared/types/contact.type';
import {DELETE_TRADE} from '../../../../graphql/mutations/tradeMutation';
import {RootContainer, TradesContainer, SearchContainer} from './ContactForm.styled';
import ContactOneTrade from './ContactOneTrade';
import {Grid, TextField} from '@material-ui/core';
import {getConstant} from './ContactTradesUtils';
import useDebounce from '../../../../hooks/useDebaunce';

interface ContactTradesProps {
    contact: ContactInterface;
}

const ContactTrades = (props: ContactTradesProps) => {
    const {contact} = props;
    const {id} = contact;

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
        setTradeUuid(id);
        setTradeOpen(true);
    };

    const debouncedGetSearchResult = useDebounce(getSearchResult, 700);

    // Load state
    const itemsToLoad = 1;
    const [isTradeOpen, setTradeOpen] = useState(false);
    const [tradeUuid, setTradeUuid] = useState<any>();
    const [loadedItems, setLoadedItems] = React.useState<string[]>([]);
    const [start, setStart] = React.useState(0);
    const [stop, setStop] = React.useState(itemsToLoad - 1);

    // Search state
    const [search, setSearch] = React.useState('');
    const [prevSearch, setPrevSearch] = React.useState('');
    const [searchResult, setSearchResult] = React.useState<string[]>([]);

    useEffect(() => {
        if (search && search !== prevSearch) {
            debouncedGetSearchResult(search);
        }
    });

    const checkMountingRef = React.useRef<any>();

    useEffect(() => {
        if (start === 0 && checkMountingRef.current) {
            loadMore();
        }
    });

    if (dropdownsLoading || isLoadingTrade) {
        return <div>Loading</div>;
    }

    const tradesToShow: any[] = trades.getContactTrades;

    function getNewItems() {
        const filteredItems = tradesToShow.reduce((acc, item, index) => {
            if (index >= start && index <= stop) {
                return [...acc, index];
            }

            return acc;
        }, []);

        const newItems: any = [...loadedItems, ...filteredItems];

        setLoadedItems(newItems);
    }

    function loadMore() {
        getNewItems();
        setStart(start + itemsToLoad);
        setStop(stop + itemsToLoad);
    }

    function getSearchResult(toSearch) {
        setPrevSearch(toSearch);

        const result = tradesToShow.filter((item) => {
            const stringToCompare = getConstant(dropdowns, item.leadStatus, 'leadStatuses');

            return (
                stringToCompare.indexOf(toSearch) !== -1 ||
                item.flat.apartmentComplex.indexOf(toSearch) !== -1 ||
                item.flat.house.indexOf(toSearch) !== -1 ||
                item.tradeNumber === toSearch ||
                item.flat.flatNumber === Number(toSearch)
            );
        });

        setSearchResult(result);
    }

    return (
        <RootContainer>
            <div onClick={setTradeOpen.bind(null, true)}>
                <AddTradeButton />
            </div>
            {console.log('result')}
            {console.log(searchResult)}
            <SearchContainer>
                <Grid item xs={12}>
                    <Field name="search">
                        {(props) => {
                            return (
                                <TextField
                                    name="search"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
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
                {search.length === 0
                    ? loadedItems.map((item: any, index) =>
                          !tradesToShow[index] ? null : (
                              <React.Fragment key={tradesToShow[item].id}>
                                  <ContactOneTrade
                                      dropdowns={dropdowns}
                                      item={tradesToShow[item]}
                                      editTrade={editTrade}
                                      deleteTrade={deleteTrade}
                                  />
                                  {index === loadedItems.length - 1 && stop <= tradesToShow.length && (
                                      <Waypoint
                                          onEnter={() => {
                                              loadMore();
                                              console.log(index);
                                          }}
                                      />
                                  )}
                              </React.Fragment>
                          )
                      )
                    : searchResult.length === 0
                    ? null
                    : searchResult.map((item: any, index) => (
                          <React.Fragment key={item.id}>
                              <ContactOneTrade
                                  dropdowns={dropdowns}
                                  item={item}
                                  editTrade={editTrade}
                                  deleteTrade={deleteTrade}
                              />
                          </React.Fragment>
                      ))}
            </TradesContainer>

            <Trade
                open={isTradeOpen}
                uuid={tradeUuid}
                contact={contact}
                handleClose={() => {
                    setTradeUuid(null);
                    setTradeOpen(false);
                }}
            />
        </RootContainer>
    );
};

export default ContactTrades;
