import React, {useState} from 'react';
import {useQuery, useMutation} from '@apollo/react-hooks';
import {GET_TRADE_DROPDOWNS} from '../../../../graphql/queries/tradeQuery';
import {APPROPRIATE_TRADES} from '../../../../graphql/queries/tradeQuery';
import {AddTradeButton} from '../../../shared/components/addTradeButton/AddTradeButton';
import Trade from '../../Trades/Trade/Trade';
import {ContactInterface} from '../../../shared/types/contact.type';
import {DELETE_TRADE} from '../../../../graphql/mutations/tradeMutation';
import {RootContainer} from './ContactForm.styled';
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

    const [isTradeOpen, setTradeOpen] = useState(false);
    const [tradeUuid, setTradeUuid] = useState<any>();

    if (dropdownsLoading || isLoadingTrade) {
        return <div>Loading</div>;
    }

    const editTrade = (id: string) => {
        setTradeUuid(id);
        setTradeOpen(true);
    };

    const tradesToShow: any[] = trades.getContactTrades;

    return (
        <RootContainer>
            <div onClick={setTradeOpen.bind(null, true)}>
                <AddTradeButton />
            </div>
            <div>
                {tradesToShow.map((i, index) => (
                    <ContactOneTrade
                        dropdowns={dropdowns}
                        item={tradesToShow[index]}
                        editTrade={editTrade}
                        deleteTrade={deleteTrade}
                        key={tradesToShow[index].id}
                    />
                ))}
            </div>
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
