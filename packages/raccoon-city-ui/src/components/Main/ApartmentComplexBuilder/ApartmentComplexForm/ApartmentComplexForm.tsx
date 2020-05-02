import {useMutation, useQuery} from '@apollo/react-hooks';
import {MenuItem} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import {DatePicker} from '@material-ui/pickers';
import React, {ChangeEvent, Fragment, useEffect, useState} from 'react';
import {Field, Form} from 'react-final-form';
import {connect} from 'react-redux';
import {Link, Redirect, useParams} from 'react-router-dom';
import styled from 'styled-components';
import {CREATE_APARTMENT_COMPLEX, EDIT_APARTMENT_COMPLEX} from '../../../../graphql/mutations/apartmentComplexMutation';
import {
    APARTMENT_COMPLEX_DROPDOWNS,
    GET_EDIT_APARTMENT_COMPLEX_INFO
} from '../../../../graphql/queries/apartmentComplexQuery';
import {setRouteParams} from '../../../../redux/actions';
import {ApartmentComplexFormValues, ApartmentComplexType} from '../../../shared/types/apartmentComplex.types';
import {getApartmentComplexVariables} from './utils';
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

export const ApartmentComplexCreateForm = connect(null, (dispatch) => ({
    applyParams: (params) => dispatch(setRouteParams(params))
}))(({applyParams}) => {
    const params = useParams();

    useEffect(() => {
        applyParams(params);
    }, [applyParams, params]);

    const {developerUuid} = useParams();
    const [createApartmentComplex, {data: apartmentComplex}] = useMutation(CREATE_APARTMENT_COMPLEX);

    if (apartmentComplex && apartmentComplex.createApartmentComplex) {
        return (
            <Redirect
                to={`/developers/${developerUuid}/apartmentComplex/${apartmentComplex.createApartmentComplex.id}/overview`}
            />
        );
    }

    return (
        <Fragment>
            <Typography variant="h5" gutterBottom={true}>
                Создание комплекса
            </Typography>
            <ApartmentComplexForm
                onSubmit={async (values) => {
                    await createApartmentComplex({
                        variables: {
                            developerUuid,
                            apartmentComplex: getApartmentComplexVariables(values as ApartmentComplexFormValues)
                        }
                    });
                }}
            />
        </Fragment>
    );
});

export const ApartmentComplexEditForm = connect(null, (dispatch) => ({
    applyParams: (params) => dispatch(setRouteParams(params))
}))(({applyParams}) => {
    const params = useParams();

    useEffect(() => {
        applyParams(params);
    }, [applyParams, params]);
    const {apartmentComplexUuid, developerUuid} = useParams();

    const {loading, error, data} = useQuery<{getApartmentComplex: ApartmentComplexType}>(
        GET_EDIT_APARTMENT_COMPLEX_INFO,
        {
            fetchPolicy: 'cache-and-network',
            variables: {
                uuid: apartmentComplexUuid
            }
        }
    );

    const [updateApartmentComplex, {data: apartmentComplex}] = useMutation(EDIT_APARTMENT_COMPLEX);

    if (apartmentComplex && apartmentComplex.updateApartmentComplex) {
        return (
            <Redirect
                to={`/developers/${developerUuid}/apartmentComplex/${apartmentComplex.updateApartmentComplex.id}/overview`}
            />
        );
    }

    if (loading) {
        return <p>Loading...</p>;
    }
    if (error || !data) {
        return <p>Error :(</p>;
    }

    const values: any = data?.getApartmentComplex;
    values.city = values?.city?.key;
    values.type = values?.type?.key;
    values.class = values?.class?.key;
    values.district = values?.district?.key;
    return (
        <Fragment>
            <Typography variant="h5" gutterBottom={true}>
                Редактирование комплекса
            </Typography>
            <ApartmentComplexForm
                onSubmit={async (updatedValues) => {
                    await updateApartmentComplex({
                        variables: {
                            uuid: apartmentComplexUuid,
                            apartmentComplex: getApartmentComplexVariables(updatedValues as ApartmentComplexFormValues)
                        }
                    });
                }}
                values={values}
            />
        </Fragment>
    );
});

interface ApartmentComplexForm {
    onSubmit: (values: any) => void;
    values?: any;
}

function getDistricts(cities, selectedCity) {
    return cities.find((city) => city.key === selectedCity).districts || [];
}

export function ApartmentComplexForm(outerProps: ApartmentComplexForm) {
    const [selectedCity, setCity] = useState<any>(outerProps.values?.city);

    const {loading, error, data} = useQuery(APARTMENT_COMPLEX_DROPDOWNS);

    if (loading || error) {
        return null;
    }

    const {cities, apartmentComplexClasses, apartmentComplexTypes} = data;

    return (
        <Fragment>
            <Form initialValues={outerProps.values} onSubmit={(e) => {}}>
                {({values, invalid, form}) => {
                    return (
                        <Fragment>
                            <Container maxWidth="md">
                                <FormContainer>
                                    <FormBlock>
                                        <Grid container={true} spacing={3}>
                                            <Grid item={true} xs={12} md={6}>
                                                <Field name="type" validate={required}>
                                                    {(props) => {
                                                        return (
                                                            <TextField
                                                                select
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
                                                                        <MenuItem key={item.key} value={item.key}>
                                                                            {item.displayName}
                                                                        </MenuItem>
                                                                    );
                                                                })}
                                                            </TextField>
                                                        );
                                                    }}
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
                                                                form.change('district', '');
                                                            }}
                                                            variant="outlined"
                                                        >
                                                            {cities.map((item: any) => {
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
                                                <Field name="district" validate={required}>
                                                    {(props) => {
                                                        return (
                                                            <TextField
                                                                select={true}
                                                                disabled={!selectedCity}
                                                                label="Район"
                                                                margin="normal"
                                                                fullWidth={true}
                                                                variant="outlined"
                                                                name={props.input.name}
                                                                value={props.input.value}
                                                                onChange={(
                                                                    e: ChangeEvent<
                                                                        HTMLInputElement | HTMLTextAreaElement
                                                                    >
                                                                ) => {
                                                                    props.input.onChange(e.target.value);
                                                                }}
                                                            >
                                                                {selectedCity &&
                                                                    getDistricts(cities, selectedCity).map(
                                                                        (item: any) => {
                                                                            return (
                                                                                <MenuItem
                                                                                    key={item.key}
                                                                                    value={item.key}
                                                                                >
                                                                                    {item.displayName}
                                                                                </MenuItem>
                                                                            );
                                                                        }
                                                                    )}
                                                            </TextField>
                                                        );
                                                    }}
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
                                                        <DatePicker
                                                            views={['year', 'month']}
                                                            name={props.input.name}
                                                            label="Начало строительства"
                                                            value={props.input.value ? props.input.value : null}
                                                            margin="normal"
                                                            fullWidth={true}
                                                            inputVariant="outlined"
                                                            onChange={props.input.onChange}
                                                        />
                                                    )}
                                                </Field>
                                            </Grid>
                                            <Grid item={true} xs={12} md={6}>
                                                <Field name="endDate" validate={required}>
                                                    {(props) => (
                                                        <DatePicker
                                                            views={['year', 'month']}
                                                            name={props.input.name}
                                                            label="Конец строительства"
                                                            value={props.input.value ? props.input.value : null}
                                                            margin="normal"
                                                            fullWidth={true}
                                                            inputVariant="outlined"
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
                                                outerProps.onSubmit(values);
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
