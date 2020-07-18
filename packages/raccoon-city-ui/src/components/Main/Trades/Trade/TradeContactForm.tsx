import {Grid, TextField} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import MuiPhoneNumber from 'material-ui-phone-number';
import React from 'react';
import {Field} from 'react-final-form';
import {FieldArray} from 'react-final-form-arrays';
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
                <FieldArray name="newContact.phones">
                    {({fields}) =>
                        fields.map((name, index) => (
                            <Grid
                                container={true}
                                key={name}
                                spacing={3}
                                justify="center"
                                alignItems="center"
                                alignContent="center"
                            >
                                <Grid item={true} xs={9}>
                                    <Field name={name} validate={isRequired}>
                                        {(props) => (
                                            <MuiPhoneNumber
                                                name={props.input.name}
                                                value={props.input.value}
                                                onChange={props.input.onChange}
                                                fullWidth
                                                preferredCountries={['ua']}
                                                regions={'europe'}
                                                defaultCountry="ua"
                                                label={`Раб телефон (${index + 1})`}
                                                variant="outlined"
                                            />
                                        )}
                                    </Field>
                                </Grid>
                                <Grid item xs={3}>
                                    <IconButton
                                        onClick={() => {
                                            fields.push(undefined);
                                        }}
                                        color="primary"
                                        aria-label="upload picture"
                                        component="span"
                                    >
                                        <AddCircleIcon />
                                    </IconButton>
                                    {index > 0 && (
                                        <IconButton
                                            color="secondary"
                                            onClick={() => {
                                                fields.remove(index);
                                            }}
                                            aria-label="upload picture"
                                            component="span"
                                        >
                                            <CancelIcon />
                                        </IconButton>
                                    )}
                                </Grid>
                            </Grid>
                        ))
                    }
                </FieldArray>
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
