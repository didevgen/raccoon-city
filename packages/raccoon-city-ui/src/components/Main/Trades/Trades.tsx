import {useMutation, useQuery} from '@apollo/react-hooks';
import {IconButton, Typography} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import DeleteIcon from '@material-ui/icons/Delete';
import GetAppIcon from '@material-ui/icons/GetApp';
import MaterialTable, {MTableToolbar} from 'material-table';
import React, {Fragment, useEffect} from 'react';
import {connect} from 'react-redux';
import {useParams} from 'react-router-dom';
import styled from 'styled-components';
import {DELETE_TRADE} from '../../../graphql/mutations/tradeMutation';
import {ALL_TRADES} from '../../../graphql/queries/tradeQuery';
import {setRouteParams, setTitle} from '../../../redux/actions';
import {Confirmation} from '../../shared/components/dialogs/ConfirmDialog';
import {SmallStateMarker} from './Trade/components';
import Trade from './Trade/Trade';

const StateContainer = styled.div`
    display: flex;
    align-items: center;
`;

export const Trades = connect(null, (dispatch) => ({
    applyParams: (params) => dispatch(setRouteParams(params)),
    applyTitle: (title) => dispatch(setTitle(title))
}))(({applyParams, applyTitle}) => {
    const params: any = useParams();

    useEffect(() => {
        applyParams(params);
        applyTitle('Сделки');
    }, [params]); // eslint-disable-line

    const {data, loading, error} = useQuery(ALL_TRADES, {
        fetchPolicy: 'cache-and-network',
        variables: {
            developerUuid: params.developerUuid
        }
    });
    const [deleteMutation] = useMutation(DELETE_TRADE, {
        refetchQueries: [
            {
                query: ALL_TRADES,
                variables: {
                    developerUuid: params.developerUuid
                }
            }
        ]
    });
    const [open, setOpen] = React.useState(false);
    const [tradeUuid, setTrade] = React.useState<any>();

    if (loading || error) {
        return null;
    }

    return (
        <Container maxWidth="lg">
            <Typography variant="h4" component="h4" gutterBottom>
                Сделки
            </Typography>
            <a
                href={`${process.env.REACT_APP_URL}spreadsheets/trades/${params.developerUuid}`}
                target="_blank"
                rel="noopener noreferrer"
            >
                <Button variant="contained" color="primary" startIcon={<GetAppIcon />}>
                    Скачать csv
                </Button>
            </a>
            <MaterialTable
                columns={[
                    {
                        width: 50,
                        title: '',
                        field: 'name',
                        render: (rowData: any) => {
                            return (
                                <Confirmation>
                                    {(confirmFn: (cb: () => void) => void) => {
                                        return (
                                            <IconButton
                                                color="secondary"
                                                component="span"
                                                onClick={() => {
                                                    confirmFn(() => async () => {
                                                        await deleteMutation({
                                                            variables: {
                                                                uuid: rowData.id
                                                            }
                                                        });
                                                    });
                                                }}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        );
                                    }}
                                </Confirmation>
                            );
                        }
                    },
                    {title: 'Номер', field: 'tradeNumber'},
                    {
                        title: 'Статус сделки',
                        field: 'state',
                        render: (rowData) => {
                            const state = data.tradeStates.find((item) => rowData.state === item.key);
                            return (
                                <StateContainer>
                                    <SmallStateMarker style={{backgroundColor: state.color}} />
                                    <div>{state?.displayName}</div>
                                </StateContainer>
                            );
                        }
                    },
                    {title: 'Менеджер', field: 'responsible.name'},
                    {title: 'ЖК', field: 'flat.apartmentComplex'},
                    {title: 'Квартира', field: 'flat.flatNumber'},
                    {
                        title: 'Бюджет',
                        field: 'flat.price',
                        render: (rowData: any) => {
                            const hasSale = !!rowData.flat.sale;
                            const price = rowData.flat.price;
                            const sale = rowData.flat.sale;
                            return (
                                <Fragment>
                                    <span className={hasSale ? 'text-crossed' : ''}>{rowData.flat.price}</span>
                                    {hasSale && (
                                        <span style={{marginLeft: '8px'}}>
                                            {(price - (price * sale) / 100).toFixed(2)}
                                        </span>
                                    )}
                                </Fragment>
                            );
                        }
                    }
                ]}
                localization={{
                    header: {
                        actions: ''
                    }
                }}
                actions={[
                    {
                        icon: 'edit',
                        tooltip: 'Редактировать',
                        onClick: (event, rowData: any) => {
                            setTrade(rowData.id);
                            setOpen(true);
                        }
                    },
                    {
                        icon: 'add',
                        tooltip: 'Новая сделка',
                        isFreeAction: true,
                        onClick: () => {
                            setTrade(null);
                            setOpen(true);
                        }
                    }
                ]}
                data={data.getAllTrades}
                title=""
                components={{
                    Toolbar: (props) => <MTableToolbar {...props} />
                }}
            />
            <Trade
                open={open}
                uuid={tradeUuid}
                handleClose={() => {
                    setTrade(null);
                    setOpen(false);
                }}
            />
        </Container>
    );
});

export default Trades;
