import {useMutation, useQuery} from '@apollo/react-hooks';
import {IconButton, Typography} from '@material-ui/core';
import Container from '@material-ui/core/Container';
import DeleteIcon from '@material-ui/icons/Delete';
import MaterialTable, {MTableToolbar} from 'material-table';
import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import {useParams} from 'react-router-dom';
import {DELETE_TRADE} from '../../../graphql/mutations/tradeMutation';
import {ALL_TRADES} from '../../../graphql/queries/tradeQuery';
import {setRouteParams, setTitle} from '../../../redux/actions';
import {Confirmation} from '../../shared/components/dialogs/ConfirmDialog';
import Trade from './Trade/Trade';

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
                    {title: 'Квартира', field: 'flat.flatNumber'}
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
