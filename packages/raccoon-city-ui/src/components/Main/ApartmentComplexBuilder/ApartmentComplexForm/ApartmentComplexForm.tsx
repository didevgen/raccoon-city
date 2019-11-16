import React, {useState, Fragment} from 'react';
import Container from '@material-ui/core/Container';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import {MenuItem} from '@material-ui/core';
import {cities, complexTypes, propertyClasses} from './constants';
import Button from '@material-ui/core/Button';

const FormContainer = styled.div`
    border: 1px solid #aaa;
`;

const FormBlock = styled.div`
    padding: 16px;
`;

const StyledButtonContainer = styled(Container)`
    margin-top: 12px;
`;

const StyledButton = styled(Button)`
    &.MuiButtonBase-root {
        margin-left: 4px;
    }
`;

export function ApartmentComplexForm() {
    const [selectedCity, setCity] = useState();
    return (
        <Fragment>
            <Container maxWidth="md">
                <FormContainer>
                    <FormBlock>
                        <Typography variant="h5" gutterBottom>
                            Создание комплекса
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <TextField select label="Тип объекта" margin="normal" fullWidth variant="outlined">
                                    {complexTypes.map((item) => {
                                        return (
                                            <MenuItem key={item.key} value={item.key}>
                                                {item.displayName}
                                            </MenuItem>
                                        );
                                    })}
                                </TextField>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Название объекта"
                                    placeholder="Placeholder"
                                    margin="normal"
                                    fullWidth
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    select
                                    label="Город"
                                    margin="normal"
                                    fullWidth
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
                            <Grid item xs={12} md={6}>
                                <TextField
                                    select
                                    disabled={!selectedCity}
                                    label="Район"
                                    margin="normal"
                                    fullWidth
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
                            <Grid item xs={12} md={6}>
                                <TextField select label="Класс" margin="normal" fullWidth variant="outlined">
                                    {propertyClasses.map((item) => {
                                        return (
                                            <MenuItem key={item.key} value={item.key}>
                                                {item.displayName}
                                            </MenuItem>
                                        );
                                    })}
                                </TextField>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Этажность"
                                    inputProps={{min: '0', step: '1'}}
                                    type="number"
                                    placeholder="Placeholder"
                                    margin="normal"
                                    fullWidth
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Количество секций"
                                    inputProps={{min: '0', step: '1'}}
                                    type="number"
                                    placeholder="Placeholder"
                                    margin="normal"
                                    fullWidth
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Цена за м2"
                                    inputProps={{min: '0', step: '1'}}
                                    type="number"
                                    placeholder="Placeholder"
                                    margin="normal"
                                    fullWidth
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Начало строительства"
                                    inputProps={{min: '0', step: '1'}}
                                    type="number"
                                    placeholder="Placeholder"
                                    margin="normal"
                                    fullWidth
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Конец строительства"
                                    inputProps={{min: '0', step: '1'}}
                                    type="number"
                                    placeholder="Placeholder"
                                    margin="normal"
                                    fullWidth
                                    variant="outlined"
                                />
                            </Grid>
                        </Grid>
                    </FormBlock>
                </FormContainer>
            </Container>
            <StyledButtonContainer maxWidth="md">
                <Grid container direction="row" spacing={2} justify="flex-end" alignItems="center">
                    <Grid justify="flex-end" container item xs={6}>
                        <StyledButton variant="outlined" size="large">
                            Отмена
                        </StyledButton>
                        <StyledButton variant="outlined" color="primary" size="large">
                            Далее
                        </StyledButton>
                    </Grid>
                </Grid>
            </StyledButtonContainer>
        </Fragment>
    );
}
