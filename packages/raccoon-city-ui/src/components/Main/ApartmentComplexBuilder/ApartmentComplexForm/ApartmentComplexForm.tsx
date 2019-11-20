import {useMutation, useQuery} from '@apollo/react-hooks';
import {MenuItem} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import React, {ChangeEvent, Fragment, useState} from 'react';
import {Field, Form} from 'react-final-form';
import {Link} from 'react-router-dom';
import styled from 'styled-components';
import {CREATE_APARTMENT_COMPLEX} from '../../../../graphql/mutations/apartmentComplexMutation';
import {APARTMENT_COMPLEX_DROPDOWNS} from '../../../../graphql/queries/apartmentComplexQuery';

const FormContainer = styled.div`
    border: 1px solid #aaa;
`;

const FormBlock = styled.div`
    padding: 16px;
`;

const StyledButtonContainer: any = styled(Container)`
    margin-top: 12px;
`;

const StyledButton = styled(Button)`
    &.MuiButtonBase-root {
        margin-left: 4px;
    }
`;

const StyledLink = styled(Link)`
    text-decoration: none;
`;

const required = (value: any) => (value ? undefined : 'Required');

export function ApartmentComplexForm() {
    const [selectedCity, setCity] = useState();
    const {loading, error, data} = useQuery(APARTMENT_COMPLEX_DROPDOWNS);
    const [createApartmentComplex, {data: apartmentComplex}] = useMutation(CREATE_APARTMENT_COMPLEX);
    if (loading || error) {
        return null;
    }

    const {cities, apartmentComplexClasses, apartmentComplexTypes} = data;

    return (
        <Fragment>
            <Form onSubmit={(e) => {}}>
                {({values, invalid}) => {
                    return (
                        <Fragment>
                            <Container maxWidth="md">
                                <FormContainer>
                                    <FormBlock>
                                        <Typography variant="h5" gutterBottom={true}>
                                            Создание комплекса
                                        </Typography>
                                        <Grid container={true} spacing={3}>
                                            <Grid item={true} xs={12} md={6}>
                                                <Field name="type" validate={required}>
                                                    {(props) => (
                                                        <TextField
                                                            select={true}
                                                            name={props.input.name}
                                                            value={props.input.value}
                                                            onChange={props.input.onChange}
                                                            label="Тип объекта"
                                                            margin="normal"
                                                            fullWidth={true}
                                                            variant="outlined"
                                                        >
                                                            {apartmentComplexTypes.map((item: any) => {
                                                                return (
                                                                    <MenuItem key={item.key} value={item}>
                                                                        {item.displayName}
                                                                    </MenuItem>
                                                                );
                                                            })}
                                                        </TextField>
                                                    )}
                                                </Field>
                                            </Grid>
                                            <Grid item={true} xs={12} md={6}>
                                                <Field name="name" validate={required}>
                                                    {(props) => (
                                                        <TextField
                                                            label="Название объекта"
                                                            margin="normal"
                                                            name={props.input.name}
                                                            value={props.input.value}
                                                            onChange={props.input.onChange}
                                                            fullWidth={true}
                                                            variant="outlined"
                                                        />
                                                    )}
                                                </Field>
                                            </Grid>
                                            <Grid item={true} xs={12} md={6}>
                                                <Field name="city" validate={required}>
                                                    {(props) => (
                                                        <TextField
                                                            select={true}
                                                            label="Город"
                                                            margin="normal"
                                                            fullWidth={true}
                                                            name={props.input.name}
                                                            value={props.input.value}
                                                            onChange={(
                                                                e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                                                            ) => {
                                                                props.input.onChange(e.target.value);
                                                                setCity(e.target.value);
                                                            }}
                                                            variant="outlined"
                                                        >
                                                            {cities.map((item: any) => {
                                                                return (
                                                                    <MenuItem key={item.key} value={item}>
                                                                        {item.displayName}
                                                                    </MenuItem>
                                                                );
                                                            })}
                                                        </TextField>
                                                    )}
                                                </Field>
                                            </Grid>
                                            <Grid item={true} xs={12} md={6}>
                                                <Field name="district" validate={required}>
                                                    {(props) => (
                                                        <TextField
                                                            select={true}
                                                            disabled={!selectedCity}
                                                            label="Район"
                                                            margin="normal"
                                                            fullWidth={true}
                                                            variant="outlined"
                                                            name={props.input.name}
                                                            value={props.input.value}
                                                            onChange={props.input.onChange}
                                                        >
                                                            {selectedCity &&
                                                                selectedCity.districts.map((item: any) => {
                                                                    return (
                                                                        <MenuItem key={item.key} value={item}>
                                                                            {item.displayName}
                                                                        </MenuItem>
                                                                    );
                                                                })}
                                                        </TextField>
                                                    )}
                                                </Field>
                                            </Grid>
                                            <Grid item={true} xs={12} md={6}>
                                                <Field name="class" validate={required}>
                                                    {(props) => (
                                                        <TextField
                                                            select={true}
                                                            label="Класс"
                                                            margin="normal"
                                                            fullWidth={true}
                                                            variant="outlined"
                                                            name={props.input.name}
                                                            value={props.input.value}
                                                            onChange={props.input.onChange}
                                                        >
                                                            {apartmentComplexClasses.map((item: any) => {
                                                                return (
                                                                    <MenuItem key={item.key} value={item.key}>
                                                                        {item.displayName}
                                                                    </MenuItem>
                                                                );
                                                            })}
                                                        </TextField>
                                                    )}
                                                </Field>
                                            </Grid>
                                            <Grid item={true} xs={12} md={6}>
                                                <Field name="levels" validate={required}>
                                                    {(props) => (
                                                        <TextField
                                                            label="Этажность"
                                                            inputProps={{min: '0', step: '1'}}
                                                            type="number"
                                                            margin="normal"
                                                            fullWidth={true}
                                                            variant="outlined"
                                                            name={props.input.name}
                                                            value={props.input.value}
                                                            onChange={props.input.onChange}
                                                        />
                                                    )}
                                                </Field>
                                            </Grid>
                                            <Grid item={true} xs={12} md={6}>
                                                <Field name="sections" validate={required}>
                                                    {(props) => (
                                                        <TextField
                                                            label="Количество секций"
                                                            inputProps={{min: '0', step: '1'}}
                                                            type="number"
                                                            margin="normal"
                                                            fullWidth={true}
                                                            variant="outlined"
                                                            name={props.input.name}
                                                            value={props.input.value}
                                                            onChange={props.input.onChange}
                                                        />
                                                    )}
                                                </Field>
                                            </Grid>
                                            <Grid item={true} xs={12} md={6}>
                                                <Field name="price" validate={required}>
                                                    {(props) => (
                                                        <TextField
                                                            label="Цена за м2"
                                                            inputProps={{min: '0', step: '1'}}
                                                            type="number"
                                                            placeholder="Placeholder"
                                                            margin="normal"
                                                            fullWidth={true}
                                                            name={props.input.name}
                                                            value={props.input.value}
                                                            onChange={props.input.onChange}
                                                            variant="outlined"
                                                        />
                                                    )}
                                                </Field>
                                            </Grid>
                                            <Grid item={true} xs={12} md={6}>
                                                <Field name="beginDate" validate={required}>
                                                    {(props) => (
                                                        <TextField
                                                            label="Начало строительства"
                                                            inputProps={{min: '0', step: '1'}}
                                                            type="number"
                                                            placeholder="Placeholder"
                                                            margin="normal"
                                                            fullWidth={true}
                                                            name={props.input.name}
                                                            value={props.input.value}
                                                            onChange={props.input.onChange}
                                                            variant="outlined"
                                                        />
                                                    )}
                                                </Field>
                                            </Grid>
                                            <Grid item={true} xs={12} md={6}>
                                                <Field name="endDate" validate={required}>
                                                    {(props) => (
                                                        <TextField
                                                            label="Конец строительства"
                                                            inputProps={{min: '0', step: '1'}}
                                                            type="number"
                                                            placeholder="Placeholder"
                                                            margin="normal"
                                                            fullWidth={true}
                                                            variant="outlined"
                                                            name={props.input.name}
                                                            value={props.input.value}
                                                            onChange={props.input.onChange}
                                                        />
                                                    )}
                                                </Field>
                                            </Grid>
                                        </Grid>
                                    </FormBlock>
                                </FormContainer>
                            </Container>
                            <StyledButtonContainer maxWidth="md">
                                <Grid
                                    container={true}
                                    direction="row"
                                    spacing={2}
                                    justify="flex-end"
                                    alignItems="center"
                                >
                                    <Grid justify="flex-end" container={true} item={true} xs={6}>
                                        <StyledLink to="/">
                                            <StyledButton variant="outlined" size="large">
                                                Отмена
                                            </StyledButton>
                                        </StyledLink>
                                        <StyledButton
                                            disabled={invalid}
                                            onClick={() => {
                                                // createApartmentComplex()
                                            }}
                                            variant="outlined"
                                            color="primary"
                                            size="large"
                                        >
                                            Далее
                                        </StyledButton>
                                    </Grid>
                                </Grid>
                            </StyledButtonContainer>
                        </Fragment>
                    );
                }}
            </Form>
        </Fragment>
    );
}
