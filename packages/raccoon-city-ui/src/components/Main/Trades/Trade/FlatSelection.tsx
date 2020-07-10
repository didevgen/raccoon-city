import {AppBar, Button, Dialog, Grid, IconButton, TextField, Toolbar} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import React, {Fragment, useState} from 'react';
import {Field, useField, useForm} from 'react-final-form';
import styled from 'styled-components';
import {isRequired} from '../../../../core/validators/validators';
import {SidebarFlat} from '../../../../graphql/queries/flatQuery';
import {ChessGrid} from '../../ChessGrid/ChessGrid';

const StyledGrid = styled(Grid)`
    margin-bottom: 8px !important;
`;

const FilterContainer = styled.div`
    margin-left: auto;
`;

export function FlatSelection() {
    const [open, setOpen] = useState(false);
    const formApi = useForm();
    const flat = useField('flat');

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Fragment>
            <Field name="flat" validate={isRequired}>
                {() => <Fragment />}
            </Field>
            {flat.input.value && (
                <StyledGrid container spacing={3}>
                    <Grid item xs={12}>
                        <Field name="flat.apartmentComplex.name">
                            {(props) => {
                                return (
                                    <TextField
                                        inputProps={{readOnly: true}}
                                        name={props.input.name}
                                        value={props.input.value}
                                        onChange={props.input.onChange}
                                        fullWidth
                                        label="Жилищный комплекс"
                                        variant="outlined"
                                    />
                                );
                            }}
                        </Field>
                    </Grid>
                    <Grid item xs={12}>
                        <Field name="flat.house.name">
                            {(props) => {
                                return (
                                    <TextField
                                        inputProps={{readOnly: true}}
                                        name={props.input.name}
                                        value={props.input.value}
                                        onChange={props.input.onChange}
                                        fullWidth
                                        label="Дом"
                                        variant="outlined"
                                    />
                                );
                            }}
                        </Field>
                    </Grid>
                    <Grid item xs={12}>
                        <Field name="flat.section">
                            {(props) => {
                                return (
                                    <TextField
                                        inputProps={{readOnly: true}}
                                        name={props.input.name}
                                        value={props.input.value}
                                        onChange={props.input.onChange}
                                        fullWidth
                                        label="Секция"
                                        variant="outlined"
                                    />
                                );
                            }}
                        </Field>
                    </Grid>
                    <Grid item xs={12}>
                        <Field name="flat.level">
                            {(props) => {
                                return (
                                    <TextField
                                        inputProps={{readOnly: true}}
                                        name={props.input.name}
                                        value={props.input.value}
                                        onChange={props.input.onChange}
                                        fullWidth
                                        label="Этаж"
                                        variant="outlined"
                                    />
                                );
                            }}
                        </Field>
                    </Grid>
                    <Grid item xs={12}>
                        <Field name="flat.flatNumber">
                            {(props) => {
                                return (
                                    <TextField
                                        inputProps={{readOnly: true}}
                                        name={props.input.name}
                                        value={props.input.value}
                                        onChange={props.input.onChange}
                                        fullWidth
                                        label="Этаж"
                                        variant="outlined"
                                    />
                                );
                            }}
                        </Field>
                    </Grid>
                </StyledGrid>
            )}
            <Button variant="outlined" color="primary" onClick={handleClickOpen}>
                Выбрать {flat.input.value ? 'другую' : ''} квартиру
            </Button>
            <Dialog fullScreen open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <AppBar>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                            <CloseIcon />
                        </IconButton>
                        <FilterContainer id="chessGridFilterContainerModal" />
                    </Toolbar>
                </AppBar>
                <ChessGrid
                    filterId={'chessGridFilterContainerModal'}
                    hasSelect
                    isPublic
                    onFlatSelected={(selectedFlat: SidebarFlat) => {
                        formApi.batch(() => {
                            formApi.change('flat', selectedFlat);
                        });
                        setOpen(false);
                    }}
                />
            </Dialog>
        </Fragment>
    );
}
