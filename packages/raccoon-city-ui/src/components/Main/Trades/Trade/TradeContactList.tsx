import {useQuery} from '@apollo/react-hooks';
import Container from '@material-ui/core/Container';
import MaterialTable, {MTableToolbar} from 'material-table';
import React from 'react';
import {useParams} from 'react-router-dom';
import {ALL_CONTACTS} from '../../../../graphql/queries/contactQuery';

export function TradeContactList({contactSelected}) {
    const params: any = useParams();

    const {data, loading, error} = useQuery(ALL_CONTACTS, {
        fetchPolicy: 'cache-and-network',
        variables: {
            developerUuid: params.developerUuid
        }
    });

    if (loading || error) {
        return null;
    }

    return (
        <Container maxWidth="lg">
            <MaterialTable
                onRowClick={(event, rowData: any) => {
                    const {tableData, __typename, ...contact} = rowData;
                    contactSelected(contact);
                }}
                columns={[
                    {title: 'Имя', field: 'name'},
                    {title: 'Телефон', field: 'phone'},
                    {title: 'Почта', field: 'email'},
                    {title: 'Должность', field: 'position'}
                ]}
                localization={{
                    header: {
                        actions: ''
                    }
                }}
                data={data.getAllContacts}
                title=""
                components={{
                    Toolbar: (props) => <MTableToolbar {...props} />
                }}
            />
        </Container>
    );
}
