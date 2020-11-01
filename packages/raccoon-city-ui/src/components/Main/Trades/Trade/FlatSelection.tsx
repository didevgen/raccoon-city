import {AppBar, Button, Dialog, Grid, IconButton, TextField, Toolbar} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import CurrencyTextField from '@unicef/material-ui-currency-textfield';
import React, {Fragment, useEffect, useState} from 'react';
import {Field, useField, useForm} from 'react-final-form';
import styled from 'styled-components';
import {isRequired} from '../../../../core/validators/validators';
import {SidebarFlat} from '../../../../graphql/queries/flatQuery';
import ChessGrid from '../../ChessGrid/ChessGrid';

const StyledGrid = styled(Grid)`
    margin-bottom: 8px !important;
`;

const FilterContainer = styled.div`
    margin-left: auto;
`;

function PriceWithSale({flat}) {
    const [price, setPrice] = useState(flat.price);
    const [sale, setSale] = useState(flat.sale);
    useEffect(() => {
        setPrice(flat.price);
        setSale(flat.sale);
    }, [flat]);
    return (
        <Fragment>
            <Grid item xs={12}>
                <Field name="flat.price">
                    {(props) => {
                        return (
                            <CurrencyTextField
                                modifyValueOnWheel={false}
                                label="Стоимость сделки"
                                variant="outlined"
                                name={props.input.name}
                                value={props.input.value}
                                minimumValue="0"
                                onChange={(event, val) => {
                                    props.input.onChange(val);
                                    setPrice(val);
                                }}
                                currencySymbol="₴"
                                outputFormat="number"
                                textAlign="left"
                                fullWidth
                                decimalCharacter="."
                                digitGroupSeparator=","
                            />
                        );
                    }}
                </Field>
                {!!price && !!sale && <div>Итого: {(price - (price * sale) / 100).toFixed(2)}</div>}
            </Grid>
            <Grid item xs={12}>
                <Field name="flat.sale" defaultValue={0}>
                    {(props) => {
                        return (
                            <CurrencyTextField
                                modifyValueOnWheel={false}
                                label="Скидка %"
                                variant="outlined"
                                name={props.input.name}
                                value={props.input.value}
                                minimumValue="0"
                                maximumValue="100"
                                onChange={(event, val) => {
                                    props.input.onChange(val);
                                    setSale(Number(val));
                                }}
                                currencySymbol="%"
                                outputFormat="number"
                                textAlign="left"
                                fullWidth
                                decimalCharacter="."
                                digitGroupSeparator=","
                            />
                        );
                    }}
                </Field>
            </Grid>
        </Fragment>
    );
}

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
                    <PriceWithSale flat={flat.input.value} />
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
                                        label="Квартира"
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
                    showRequestButton={false}
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
