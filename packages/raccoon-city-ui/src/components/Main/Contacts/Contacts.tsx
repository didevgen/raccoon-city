import {Button, Typography} from '@material-ui/core';
import Container from '@material-ui/core/Container';
import MaterialTable, {MTableToolbar} from 'material-table';
import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import {useParams} from 'react-router-dom';
import {setRouteParams, setTitle} from '../../../redux/actions';
import Contact from './Contact/Contact';

export const Contacts = connect(null, (dispatch) => ({
    applyParams: (params) => dispatch(setRouteParams(params)),
    applyTitle: (title) => dispatch(setTitle(title))
}))(({applyParams, applyTitle}) => {
    const params = useParams();

    useEffect(() => {
        applyParams(params);
        applyTitle('Контакты');
    }, [params]); // eslint-disable-line

    const [open, setOpen] = React.useState(false);

    return (
        <Container maxWidth="lg">
            <Typography variant="h4" component="h4" gutterBottom>
                Контакты
            </Typography>
            <Button
                variant="contained"
                onClick={() => {
                    setOpen(true);
                }}
            >
                Новый контакт
            </Button>
            <MaterialTable
                columns={[
                    {title: 'Имя', field: 'name'},
                    {title: 'Телефон', field: 'surname'},
                    {title: 'Почта', field: 'birthYear'}
                ]}
                data={[{name: 'Mehmet', surname: 'Baran', birthYear: 1987, birthCity: 63}]}
                title=""
                components={{
                    Toolbar: (props) => <MTableToolbar {...props} />
                }}
            />
            <Contact
                open={open}
                handleClose={() => {
                    setOpen(false);
                }}
            />
        </Container>
    );
});

export default Contacts;
