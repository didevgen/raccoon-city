import {MenuItem} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import React, {Fragment, useState} from 'react';
import {Link} from 'react-router-dom';
import styled from 'styled-components';
import {cities, complexTypes, propertyClasses} from './constants';

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

export function ApartmentComplexForm() {
    const [selectedCity, setCity] = useState();
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
                                <TextField
                                    select={true}
                                    label="Тип объекта"
                                    margin="normal"
                                    fullWidth={true}
                                    variant="outlined"
                                >
                                    {complexTypes.map((item) => {
                                        return (
                                            <MenuItem key={item.key} value={item.key}>
                                                {item.displayName}
                                            </MenuItem>
                                        );
                                    })}
                                </TextField>
                            </Grid>
                            <Grid item={true} xs={12} md={6}>
                                <TextField
                                    label="Название объекта"
                                    placeholder="Placeholder"
                                    margin="normal"
                                    fullWidth={true}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item={true} xs={12} md={6}>
                                <TextField
                                    select={true}
                                    label="Город"
                                    margin="normal"
                                    fullWidth={true}
                                    value={selectedCity}
                                    onChange={(e) => {
                                        setCity(cities.find((i) => i.key === e.target.value));
                                    }}
                                    variant="outlined"
                                >
                                    {cities.map((item) => {
                                        return (
                                            <MenuItem key={item.key} value={item.key}>
                                                {item.displayName}
                                            </MenuItem>
                                        );
                                    })}
                                </TextField>
                            </Grid>
                            <Grid item={true} xs={12} md={6}>
                                <TextField
                                    select={true}
                                    disabled={!selectedCity}
                                    label="Район"
                                    margin="normal"
                                    fullWidth={true}
                                    variant="outlined"
                                >
                                    {selectedCity &&
                                        selectedCity.districts.map((item: any) => {
                                            return (
                                                <MenuItem key={item.key} value={item.key}>
                                                    {item.displayName}
                                                </MenuItem>
                                            );
                                        })}
                                </TextField>
                            </Grid>
                            <Grid item={true} xs={12} md={6}>
                                <TextField
                                    select={true}
                                    label="Класс"
                                    margin="normal"
                                    fullWidth={true}
                                    variant="outlined"
                                >
                                    {propertyClasses.map((item) => {
                                        return (
                                            <MenuItem key={item.key} value={item.key}>
                                                {item.displayName}
                                            </MenuItem>
                                        );
                                    })}
                                </TextField>
                            </Grid>
                            <Grid item={true} xs={12} md={6}>
                                <TextField
                                    label="Этажность"
                                    inputProps={{min: '0', step: '1'}}
                                    type="number"
                                    placeholder="Placeholder"
                                    margin="normal"
                                    fullWidth={true}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item={true} xs={12} md={6}>
                                <TextField
                                    label="Количество секций"
                                    inputProps={{min: '0', step: '1'}}
                                    type="number"
                                    placeholder="Placeholder"
                                    margin="normal"
                                    fullWidth={true}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item={true} xs={12} md={6}>
                                <TextField
                                    label="Цена за м2"
                                    inputProps={{min: '0', step: '1'}}
                                    type="number"
                                    placeholder="Placeholder"
                                    margin="normal"
                                    fullWidth={true}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item={true} xs={12} md={6}>
                                <TextField
                                    label="Начало строительства"
                                    inputProps={{min: '0', step: '1'}}
                                    type="number"
                                    placeholder="Placeholder"
                                    margin="normal"
                                    fullWidth={true}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item={true} xs={12} md={6}>
                                <TextField
                                    label="Конец строительства"
                                    inputProps={{min: '0', step: '1'}}
                                    type="number"
                                    placeholder="Placeholder"
                                    margin="normal"
                                    fullWidth={true}
                                    variant="outlined"
                                />
                            </Grid>
                        </Grid>
                    </FormBlock>
                </FormContainer>
            </Container>
            <StyledButtonContainer maxWidth="md">
                <Grid container={true} direction="row" spacing={2} justify="flex-end" alignItems="center">
                    <Grid justify="flex-end" container={true} item={true} xs={6}>
                        <StyledLink to="/">
                            <StyledButton variant="outlined" size="large">
                                Отмена
                            </StyledButton>
                        </StyledLink>
                        <StyledLink to="/apartmentComplex/1/images">
                            <StyledButton variant="outlined" color="primary" size="large">
                                Далее
                            </StyledButton>
                        </StyledLink>
                    </Grid>
                </Grid>
            </StyledButtonContainer>
        </Fragment>
    );
}
