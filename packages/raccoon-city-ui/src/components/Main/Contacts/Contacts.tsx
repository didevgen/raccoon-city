import {useMutation, useQuery} from '@apollo/react-hooks';
import {IconButton, Typography} from '@material-ui/core';
import Container from '@material-ui/core/Container';
import DeleteIcon from '@material-ui/icons/Delete';
import MaterialTable, {MTableToolbar} from 'material-table';
import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import {useParams} from 'react-router-dom';
import {DELETE_CONTACT} from '../../../graphql/mutations/contactMutation';
import {ALL_CONTACTS} from '../../../graphql/queries/contactQuery';
import {setRouteParams, setTitle} from '../../../redux/actions';
import {Confirmation} from '../../shared/components/dialogs/ConfirmDialog';
import Contact from './Contact/Contact';

export const Contacts = connect(null, (dispatch) => ({
    applyParams: (params) => dispatch(setRouteParams(params)),
    applyTitle: (title) => dispatch(setTitle(title))
}))(({applyParams, applyTitle}) => {
    const params: any = useParams();

    useEffect(() => {
        applyParams(params);
        applyTitle('Контакты');
    }, [params]); // eslint-disable-line

    const {data, loading, error} = useQuery(ALL_CONTACTS, {
        fetchPolicy: 'cache-and-network',
        variables: {
            developerUuid: params.developerUuid
        }
    });
    const [deleteMutation] = useMutation(DELETE_CONTACT, {
        refetchQueries: [
            {
                query: ALL_CONTACTS,
                variables: {
                    developerUuid: params.developerUuid
                }
            }
        ]
    });
    const [open, setOpen] = React.useState(false);
    const [contactUuid, setContact] = React.useState<any>();

    if (loading || error) {
        return null;
    }

    return (
        <Container maxWidth="lg">
            <Typography variant="h4" component="h4" gutterBottom>
                Контакты
            </Typography>
            <MaterialTable
                columns={[
                    {
                        title: '',
                        width: 50,
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
                    {title: 'Имя', field: 'name'},
                    {
                        title: 'Телефон',
                        field: 'phones',
                        render: (rowData: any) => {
                            return rowData.phones.map((phone, i) => {
                                return <div key={`${rowData.id}${i}`}>{phone}</div>;
                            });
                        }
                    },
                    {title: 'Почта', field: 'email'},
                    {title: 'Должность', field: 'position'}
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
                            setContact(rowData.id);
                            setOpen(true);
                        }
                    },
                    {
                        icon: 'add',
                        tooltip: 'Новый контакт',
                        isFreeAction: true,
                        onClick: () => {
                            setContact(null);
                            setOpen(true);
                        }
                    }
                ]}
                data={data.getAllContacts}
                title=""
                components={{
                    Toolbar: (props) => <MTableToolbar {...props} />
                }}
            />
            <Contact
                open={open}
                uuid={contactUuid}
                handleClose={() => {
                    setContact(null);
                    setOpen(false);
                }}
            />
        </Container>
    );
});

export default Contacts;
