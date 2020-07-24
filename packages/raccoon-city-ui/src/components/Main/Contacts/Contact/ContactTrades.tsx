import React, {useState} from 'react';
import {useQuery} from '@apollo/react-hooks';
import {Accordion, AccordionSummary, AccordionDetails} from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import {GET_TRADE_DROPDOWNS} from '../../../../graphql/queries/tradeQuery';
import {format} from 'date-fns';
import {getConstant, getClientInterests} from './ContactTradesUtils';
import {RootContainer, TradeTitleContainer, Bold, EditTrade} from './ContactForm.styled';
import {APPROPRIATE_TRADES} from '../../../../graphql/queries/tradeQuery';
import {AddTradeButton} from '../../../shared/components/addTradeButton/AddTradeButton';
import Trade from '../../Trades/Trade/Trade';

interface ContactInterface {}

interface ContactTradesProps {
    contact: any;
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

    const [isTradeOpen, setTradeOpen] = useState(false);
    const [tradeUuid, setTradeUuid] = useState<any>();

    if (dropdownsLoading || isLoadingTrade) {
        return <div>Loading</div>;
    }

    const editTrade = (id: string) => {
        setTradeUuid(id);
        setTradeOpen(true);
    };

    return (
        <RootContainer>
            <div onClick={setTradeOpen.bind(null, true)}>
                <AddTradeButton />
            </div>
            <div>
                {trades.getContactTrades.map((item) => (
                    <Accordion key={item.id} TransitionProps={{unmountOnExit: true}}>
                        <AccordionSummary aria-controls="panel1a-content" id={item.id}>
                            <TradeTitleContainer>
                                <p>
                                    <Bold>№ :</Bold>&nbsp;{item.tradeNumber}
                                    <Bold>Статус :</Bold>&nbsp;{getConstant(dropdowns, item.leadStatus, 'leadStatuses')}
                                </p>
                                <p>
                                    <Bold>ЖК :</Bold>
                                    {item.flat.apartmentComplex}
                                    <Bold>Дом :</Bold>
                                    {item.flat.house}
                                    <Bold>Квартира :</Bold>
                                    {item.flat.flatNumber}
                                </p>
                            </TradeTitleContainer>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Table aria-label="simple table">
                                <TableBody>
                                    <TableRow key={item.key}>
                                        <TableCell component="th" scope="row">
                                            <Typography variant="body2" component="p">
                                                Статус сделки
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Typography variant="body2" component="p">
                                                {getConstant(dropdowns, item.state, 'tradeStates')}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>

                                    <TableRow key={item.key}>
                                        <TableCell component="th" scope="row">
                                            <Typography variant="body2" component="p">
                                                Стоимость сделки
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Typography variant="body2" component="p">
                                                {item.budget}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>

                                    <TableRow key={item.key}>
                                        <TableCell component="th" scope="row">
                                            <Typography variant="body2" component="p">
                                                Статус лида
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Typography variant="body2" component="p">
                                                {getConstant(dropdowns, item.leadStatus, 'leadStatuses')}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>

                                    <TableRow key={item.key}>
                                        <TableCell component="th" scope="row">
                                            <Typography variant="body2" component="p">
                                                Что интересует
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Typography variant="body2" component="p">
                                                {getClientInterests(dropdowns, item.clientInterests)}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>

                                    <TableRow key={item.key}>
                                        <TableCell component="th" scope="row">
                                            <Typography variant="body2" component="p">
                                                Ссылка
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Typography variant="body2" component="p">
                                                {item.link}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>

                                    <TableRow key={item.key}>
                                        <TableCell component="th" scope="row">
                                            <Typography variant="body2" component="p">
                                                Дата визита
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Typography variant="body2" component="p">
                                                {format(new Date(item.visitDate), 'dd.MM.yyyy')}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>

                                    <TableRow key={item.key}>
                                        <TableCell component="th" scope="row">
                                            <Typography variant="body2" component="p">
                                                Дата следующего визита
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Typography variant="body2" component="p">
                                                {format(new Date(item.nextVisitDate), 'dd.MM.yyyy')}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>

                                    <TableRow key={item.key}>
                                        <TableCell component="th" scope="row">
                                            <Typography variant="body2" component="p">
                                                Тип оплаты
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Typography variant="body2" component="p">
                                                {getConstant(dropdowns, item.paymentType, 'paymentTypes')}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>

                                    <TableRow key={item.key}>
                                        <TableCell component="th" scope="row">
                                            <Typography variant="body2" component="p">
                                                Через кого оплата
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Typography variant="body2" component="p">
                                                {getConstant(dropdowns, item.paymentProvider, 'paymentProviders')}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>

                                    <TableRow key={item.key}>
                                        <TableCell component="th" scope="row">
                                            <Typography variant="body2" component="p">
                                                Цена
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            {`${new Intl.NumberFormat('ru-RU').format(item.price)}₴`}
                                        </TableCell>
                                    </TableRow>

                                    <TableRow key={item.key}>
                                        <TableCell component="th" scope="row">
                                            <Typography variant="body2" component="p">
                                                Источник заявки
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Typography variant="body2" component="p">
                                                {getConstant(dropdowns, item.tradeSource, 'tradeSources')}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>

                                    <TableRow key={item.key}>
                                        <TableCell component="th" scope="row">
                                            <Typography variant="body2" component="p">
                                                Тип объекта
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Typography variant="body2" component="p">
                                                {getConstant(dropdowns, item.propertyType, 'propertyTypes')}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>

                                    <TableRow key={item.key}>
                                        <TableCell component="th" scope="row">
                                            <Typography variant="body2" component="p">
                                                Номер квартиры
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Typography variant="body2" component="p">
                                                {item.flat.flatNumber}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>

                                    <TableRow key={item.key}>
                                        <TableCell component="th" scope="row">
                                            <Typography variant="body2" component="p">
                                                Секция
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Typography variant="body2" component="p">
                                                {item.flat.section}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>

                                    <TableRow key={item.key}>
                                        <TableCell component="th" scope="row">
                                            <Typography variant="body2" component="p">
                                                Этаж
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Typography variant="body2" component="p">
                                                {item.flat.level}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </AccordionDetails>
                        <EditTrade onClick={editTrade.bind(null, item.id)}>Редактировать</EditTrade>
                    </Accordion>
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
