import Container from '@material-ui/core/Container';
import MaterialTable from 'material-table';
import React from 'react';

export default function Contacts() {
    return (
        <Container maxWidth="lg">
            <MaterialTable
                columns={[
                    {title: 'Имя', field: 'name'},
                    {title: 'Телефон', field: 'surname'},
                    {title: 'Почта', field: 'birthYear'}
                ]}
                data={[{name: 'Mehmet', surname: 'Baran', birthYear: 1987, birthCity: 63}]}
                title=""
            />
        </Container>
    );
}
