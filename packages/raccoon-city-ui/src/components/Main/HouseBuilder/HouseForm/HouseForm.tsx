import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import {Fragment} from 'react';
import {Field, Form} from 'react-final-form';

const required = (value: any) => (value ? undefined : 'Required');

export function HouseForm() {
    return (
        <Fragment>
            <Typography variant="h5" gutterBottom={true}>
                Создание дома
            </Typography>
            <Form onSubmit={(e) => {}}>
                {({values, invalid}) => {
                    return (
                        <Fragment>
                            <Field name="name" validate={required}>
                                {(props) => (
                                    <TextField
                                        label="Название дома"
                                        margin="normal"
                                        name={props.input.name}
                                        value={props.input.value}
                                        onChange={props.input.onChange}
                                        fullWidth={true}
                                        variant="outlined"
                                    />
                                )}
                            </Field>
                            <Field name="address" validate={required}>
                                {(props) => (
                                    <TextField
                                        label="Строительный адрес"
                                        margin="normal"
                                        name={props.input.name}
                                        value={props.input.value}
                                        onChange={props.input.onChange}
                                        fullWidth={true}
                                        variant="outlined"
                                    />
                                )}
                            </Field>
                            <Field name="price" validate={required}>
                                {(props) => (
                                    <TextField
                                        label="Стоимость квартир в доме"
                                        margin="normal"
                                        inputProps={{min: '0', step: '1'}}
                                        type="number"
                                        name={props.input.name}
                                        value={props.input.value}
                                        onChange={props.input.onChange}
                                        fullWidth={true}
                                        variant="outlined"
                                    />
                                )}
                            </Field>
                            <Field name="parking" validate={required}>
                                {(props) => (
                                    <FormControl component="fieldset">
                                        <FormLabel component="legend">Паркова</FormLabel>
                                        <RadioGroup
                                            defaultValue="false"
                                            aria-label="gender"
                                            row
                                            name="customized-radios"
                                        >
                                            <FormControlLabel value="true" control={<Radio />} label="Есть" />
                                            <FormControlLabel value="false" control={<Radio />} label="Нет" />
                                        </RadioGroup>
                                    </FormControl>
                                )}
                            </Field>
                        </Fragment>
                    );
                }}
            </Form>
        </Fragment>
    );
}
