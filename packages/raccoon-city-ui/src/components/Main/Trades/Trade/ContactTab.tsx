import {FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup} from '@material-ui/core';
import React, {useState} from 'react';
import {Field, useField} from 'react-final-form';
import {TradeContactForm} from './TradeContactForm';
import {TradeExistingContact} from './TradeExistingContact';

export function ContactTab() {
    const contactTypeValue = useField('contactType');
    const [contactType, setContactType] = useState<any>(contactTypeValue.input.value || 'existing');
    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <FormControl component="fieldset">
                    <FormLabel component="legend">Тип контакта</FormLabel>
                    <Field name="contactType">
                        {(props) => {
                            return (
                                <RadioGroup
                                    row
                                    aria-label="position"
                                    name="position"
                                    value={contactType}
                                    onChange={(e, val) => {
                                        setContactType(val);
                                        props.input.onChange(val);
                                    }}
                                >
                                    <FormControlLabel value="new" control={<Radio color="primary" />} label="Новый" />
                                    <FormControlLabel
                                        value="existing"
                                        control={<Radio color="primary" />}
                                        label="Существующий"
                                    />
                                </RadioGroup>
                            );
                        }}
                    </Field>
                </FormControl>
            </Grid>
            <Grid item xs={12}>
                {contactType === 'new' && <TradeContactForm />}
                {contactType === 'existing' && <TradeExistingContact />}
            </Grid>
        </Grid>
    );
}
