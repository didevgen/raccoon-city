import {useMutation} from '@apollo/react-hooks';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Grid from '@material-ui/core/Grid';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import {Fragment} from 'react';
import {Field, Form} from 'react-final-form';
import {Redirect, useParams} from 'react-router-dom';
import styled from 'styled-components';
import {CREATE_HOUSE} from '../../../../graphql/mutations/houseMutation';
import {StyledLink} from '../../../shared/components/styled';
import {getHouseDataVariables, HouseFormValues} from './utils';

const required = (value: any) => (value ? undefined : 'Required');

const StyledButton = styled(Button)`
    &.MuiButtonBase-root {
        margin-left: 4px;
    }
`;

export function HouseForm() {
    const [createHouse, {data, loading}] = useMutation(CREATE_HOUSE);
    const {uuid} = useParams();

    if (data) {
        return <Redirect to={`/apartmentComplex/${uuid}/overview/houses`} />;
    }

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
                            <Field name="parking" type="radio" defaultValue={'false'} validate={required}>
                                {(props) => (
                                    <FormControl component="fieldset">
                                        <FormLabel component="legend">Паркова</FormLabel>
                                        <RadioGroup
                                            defaultValue="false"
                                            aria-label="gender"
                                            row={true}
                                            name={props.input.name}
                                            value={props.input.value}
                                            onChange={props.input.onChange}
                                        >
                                            <FormControlLabel value="true" control={<Radio />} label="Есть" />
                                            <FormControlLabel value="false" control={<Radio />} label="Нет" />
                                        </RadioGroup>
                                    </FormControl>
                                )}
                            </Field>
                            <Grid container={true} direction="row" spacing={2} justify="flex-end" alignItems="center">
                                <Grid justify="flex-end" container={true} item={true} xs={6}>
                                    <StyledLink to={`/apartmentComplex/${uuid}/overview/houses`}>
                                        <StyledButton variant="outlined" size="large">
                                            Отмена
                                        </StyledButton>
                                    </StyledLink>
                                    <StyledButton
                                        disabled={invalid}
                                        onClick={async () => {
                                            await createHouse({
                                                variables: {
                                                    apartmentComplexId: uuid,
                                                    houseData: getHouseDataVariables(values as HouseFormValues)
                                                }
                                            });
                                        }}
                                        variant="outlined"
                                        color="primary"
                                        size="large"
                                    >
                                        {loading && <CircularProgress size={30} thickness={5} />}
                                        Далее
                                    </StyledButton>
                                </Grid>
                            </Grid>
                        </Fragment>
                    );
                }}
            </Form>
        </Fragment>
    );
}
