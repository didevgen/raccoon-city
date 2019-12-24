import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import React, {Fragment} from 'react';
import {Field, Form} from 'react-final-form';
import {isRequired, isRequiredAndIsInteger, isRequiredAndIsNumber} from '../../../../../core/validators/validators';
import {Flat} from '../../../../shared/types/flat.types';
import {MenuItem} from '@material-ui/core';
import {FLAT_STATUSES} from '../../../../../core/constants';
import {useMutation} from '@apollo/react-hooks';
import {UPDATE_FLAT} from '../../../../../graphql/mutations/flatMutation';
import omit from 'ramda/src/omit';

interface FlatFormDialogProps {
    open: boolean;
    setOpen: (value: boolean) => void;
    flat: Flat;
}

function toGraphqlFlat(flat: Flat): Flat {
    return omit(['__typename'], {
        ...flat,
        flatNumber: Number(flat.flatNumber),
        area: Number(flat.area),
        entrance: Number(flat.entrance),
        level: Number(flat.level),
        price: Number(flat.price),
        roomAmount: Number(flat.roomAmount)
    });
}

export function FlatFormDialog({open, setOpen, flat}: FlatFormDialogProps) {
    const [updateFlat] = useMutation(UPDATE_FLAT);
    const handleClose = () => {
        setOpen(false);
    };

    const handleSave = (values: Flat) => {
        return async () => {
            await updateFlat({
                variables: {
                    flat: toGraphqlFlat(values)
                }
            });
        };
    };

    return (
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <Form initialValues={{...flat}} onSubmit={(e) => {}}>
                {({values, invalid}) => {
                    return (
                        <Fragment>
                            <DialogTitle id="form-dialog-title">Редактировать квартиру</DialogTitle>
                            <DialogContent>
                                <Grid container={true} spacing={1}>
                                    <Grid item={true} xs={12}>
                                        <Field name="flatNumber" validate={isRequiredAndIsInteger}>
                                            {(props) => (
                                                <TextField
                                                    label="Номер квартиры"
                                                    margin="normal"
                                                    name={props.input.name}
                                                    value={props.input.value}
                                                    onChange={props.input.onChange}
                                                    error={!!props.meta.error}
                                                    helperText={props.meta.error}
                                                    fullWidth={true}
                                                    variant="outlined"
                                                />
                                            )}
                                        </Field>
                                    </Grid>
                                    <Grid item={true} xs={12}>
                                        <Field name="price" validate={isRequiredAndIsNumber}>
                                            {(props) => {
                                                return (
                                                    <TextField
                                                        label="Цена"
                                                        margin="normal"
                                                        name={props.input.name}
                                                        value={props.input.value}
                                                        onChange={props.input.onChange}
                                                        fullWidth={true}
                                                        error={!!props.meta.error}
                                                        helperText={props.meta.error}
                                                        variant="outlined"
                                                    />
                                                );
                                            }}
                                        </Field>
                                    </Grid>
                                    <Grid item={true} xs={12}>
                                        <Field name="level" validate={isRequiredAndIsInteger}>
                                            {(props) => (
                                                <TextField
                                                    label="Этаж"
                                                    margin="normal"
                                                    name={props.input.name}
                                                    value={props.input.value}
                                                    onChange={props.input.onChange}
                                                    fullWidth={true}
                                                    error={!!props.meta.error}
                                                    helperText={props.meta.error}
                                                    variant="outlined"
                                                />
                                            )}
                                        </Field>
                                    </Grid>
                                    <Grid item={true} xs={12}>
                                        <Field name="entrance" validate={isRequiredAndIsInteger}>
                                            {(props) => (
                                                <TextField
                                                    label="Подъезд"
                                                    margin="normal"
                                                    name={props.input.name}
                                                    value={props.input.value}
                                                    onChange={props.input.onChange}
                                                    fullWidth={true}
                                                    error={!!props.meta.error}
                                                    helperText={props.meta.error}
                                                    variant="outlined"
                                                />
                                            )}
                                        </Field>
                                    </Grid>
                                    <Grid item={true} xs={12}>
                                        <Field name="area" validate={isRequiredAndIsNumber}>
                                            {(props) => (
                                                <TextField
                                                    label="Площадь"
                                                    margin="normal"
                                                    name={props.input.name}
                                                    value={props.input.value}
                                                    onChange={props.input.onChange}
                                                    fullWidth={true}
                                                    error={!!props.meta.error}
                                                    helperText={props.meta.error}
                                                    variant="outlined"
                                                />
                                            )}
                                        </Field>
                                    </Grid>
                                    <Grid item={true} xs={12}>
                                        <Field name="status" validate={isRequired}>
                                            {(props) => (
                                                <TextField
                                                    select={true}
                                                    label="Статус"
                                                    margin="normal"
                                                    name={props.input.name}
                                                    value={props.input.value}
                                                    onChange={props.input.onChange}
                                                    fullWidth={true}
                                                    error={!!props.meta.error}
                                                    helperText={props.meta.error}
                                                    variant="outlined"
                                                >
                                                    {FLAT_STATUSES.map((item: any) => {
                                                        return (
                                                            <MenuItem key={item.value} value={item.value}>
                                                                {item.label}
                                                            </MenuItem>
                                                        );
                                                    })}
                                                </TextField>
                                            )}
                                        </Field>
                                    </Grid>
                                    <Grid item={true} xs={12}>
                                        <Field name="roomAmount" validate={isRequiredAndIsInteger}>
                                            {(props) => (
                                                <TextField
                                                    label="Количество комнат"
                                                    margin="normal"
                                                    name={props.input.name}
                                                    value={props.input.value}
                                                    onChange={props.input.onChange}
                                                    fullWidth={true}
                                                    error={!!props.meta.error}
                                                    helperText={props.meta.error}
                                                    variant="outlined"
                                                />
                                            )}
                                        </Field>
                                    </Grid>
                                </Grid>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleClose} color="primary">
                                    Отмена
                                </Button>
                                <Button disabled={invalid} onClick={handleSave(values)} color="primary">
                                    Сохранить
                                </Button>
                            </DialogActions>
                        </Fragment>
                    );
                }}
            </Form>
        </Dialog>
    );
}
