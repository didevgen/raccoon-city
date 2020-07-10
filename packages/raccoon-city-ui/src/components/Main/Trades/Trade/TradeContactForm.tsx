import {Grid, TextField} from '@material-ui/core';
import React from 'react';
import {Field} from 'react-final-form';
import {isRequired} from '../../../../core/validators/validators';

export function TradeContactForm() {
    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Field name="newContact.name" validate={isRequired}>
                    {(props) => {
                        return (
                            <TextField
                                name={props.input.name}
                                value={props.input.value}
                                onChange={props.input.onChange}
                                fullWidth
                                label="ФИО"
                                variant="outlined"
                            />
                        );
                    }}
                </Field>
            </Grid>
            <Grid item xs={12}>
                <Field name="newContact.position">
                    {(props) => {
                        return (
                            <TextField
                                name={props.input.name}
                                value={props.input.value}
                                onChange={props.input.onChange}
                                fullWidth
                                label="Должность"
                                variant="outlined"
                            />
                        );
                    }}
                </Field>
            </Grid>
            <Grid item xs={12}>
                <Field name="newContact.phone">
                    {(props) => {
                        return (
                            <TextField
                                name={props.input.name}
                                value={props.input.value}
                                onChange={props.input.onChange}
                                fullWidth
                                label="Раб телефон"
                                variant="outlined"
                            />
                        );
                    }}
                </Field>
            </Grid>
            <Grid item xs={12}>
                <Field name="newContact.email">
                    {(props) => {
                        return (
                            <TextField
                                name={props.input.name}
                                value={props.input.value}
                                onChange={props.input.onChange}
                                fullWidth
                                label="Email"
                                variant="outlined"
                            />
                        );
                    }}
                </Field>
            </Grid>
        </Grid>
    );
}
