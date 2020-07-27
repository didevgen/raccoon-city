import React, {useState, useEffect} from 'react';
import {useQuery, useMutation} from '@apollo/react-hooks';
import {Waypoint} from 'react-waypoint';
import {GET_TRADE_DROPDOWNS} from '../../../../graphql/queries/tradeQuery';
import {APPROPRIATE_TRADES} from '../../../../graphql/queries/tradeQuery';
import {AddTradeButton} from '../../../shared/components/addTradeButton/AddTradeButton';
import Trade from '../../Trades/Trade/Trade';
import {ContactInterface} from '../../../shared/types/contact.type';
import {DELETE_TRADE} from '../../../../graphql/mutations/tradeMutation';
import {RootContainer, TradesContainer} from './ContactForm.styled';
import ContactOneTrade from './ContactOneTrade';

interface ContactTradesProps {
    contact: ContactInterface;
}

const ContactTrades = (props: ContactTradesProps) => {
    const {contact} = props;
    const {id} = contact;

    const {data: dropdowns, loading: dropdownsLoading} = useQuery(GET_TRADE_DROPDOWNS);
    const {data: trades, loading: isLoadingTrade} = useQuery(APPROPRIATE_TRADES, {
        fetchPolicy: 'cache-and-network',
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

    const itemsToLoad = 3;
    const [isTradeOpen, setTradeOpen] = useState(false);
    const [tradeUuid, setTradeUuid] = useState<any>();
    const [loadedItems, setLoadedItems] = React.useState([]);
    const [start, setStart] = React.useState(0);
    const [stop, setStop] = React.useState(itemsToLoad - 1);

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
        const filteredItems = tradesToShow.filter((item, index) => {
            return index >= start && index <= stop;
        });

        const newItems: any = [...loadedItems, ...filteredItems];

        setLoadedItems(newItems);
    }

    function loadMore() {
        getNewItems();
        setStart(start + itemsToLoad);
        setStop(stop + itemsToLoad);
    }

    return (
        <RootContainer>
            <div onClick={setTradeOpen.bind(null, true)}>
                <AddTradeButton />
            </div>
            <TradesContainer ref={checkMountingRef}>
                {loadedItems.map((i, index) => (
                    <React.Fragment key={tradesToShow[index].id}>
                        <ContactOneTrade
                            dropdowns={dropdowns}
                            item={tradesToShow[index]}
                            editTrade={editTrade}
                            deleteTrade={deleteTrade}
                        />
                        {index === loadedItems.length - 1 && stop <= tradesToShow.length && (
                            <Waypoint onEnter={loadMore} />
                        )}
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
