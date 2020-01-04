import {useMutation} from '@apollo/react-hooks';
import {MenuItem} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import omit from 'ramda/src/omit';
import React, {Fragment} from 'react';
import {Field, Form} from 'react-final-form';
import {useParams} from 'react-router-dom';
import {FLAT_STATUSES} from '../../../../../core/constants';
import {
    getError,
    isRequired,
    isRequiredAndIsInteger,
    isRequiredAndIsNumber
} from '../../../../../core/validators/validators';
import {CREATE_FLAT, UPDATE_FLAT} from '../../../../../graphql/mutations/flatMutation';
import {GET_GROUPED_FLATS} from '../../../../../graphql/queries/houseQuery';
import {Flat} from '../../../../shared/types/flat.types';

interface FlatFormDialogProps {
    open: boolean;
    setOpen: (value: boolean) => void;
    flat: Flat;
    isNew?: boolean;
    maxLevel: number;
}

function toGraphqlFlat(flat: Flat): Flat {
    return omit(['__typename'], {
        ...flat,
        flatNumber: Number(flat.flatNumber),
        area: Number(flat.area),
        section: flat.section,
        level: Number(flat.level),
        price: Number(flat.price),
        roomAmount: Number(flat.roomAmount)
    });
}

export function FlatFormDialog({open, setOpen, flat, isNew}: FlatFormDialogProps) {
    const {houseUuid: uuid} = useParams();
    const [updateFlat] = useMutation(UPDATE_FLAT);
    const [createFlat] = useMutation(CREATE_FLAT);
    const handleClose = () => {
        setOpen(false);
    };

    const handleSave = (values: Flat) => {
        return async () => {
            if (isNew) {
                await createFlat({
                    variables: {
                        flat: toGraphqlFlat(values),
                        houseGuid: uuid
                    },
                    refetchQueries: [
                        {
                            query: GET_GROUPED_FLATS,
                            variables: {
                                uuid
                            }
                        }
                    ]
                });
                setOpen(false);
                return;
            }
            await updateFlat({
                variables: {
                    flat: toGraphqlFlat(values)
                },
                refetchQueries: [
                    {
                        query: GET_GROUPED_FLATS,
                        variables: {
                            uuid
                        }
                    }
                ]
            });
            setOpen(false);
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
                                    <Grid item={true} xs={6}>
                                        <Field name="flatNumber" validate={isRequiredAndIsInteger}>
                                            {({input, meta, ...rest}) => (
                                                <TextField
                                                    label="Номер квартиры"
                                                    margin="normal"
                                                    {...input}
                                                    {...rest}
                                                    error={!!getError(meta)}
                                                    helperText={getError(meta)}
                                                    fullWidth={true}
                                                    variant="outlined"
                                                />
                                            )}
                                        </Field>
                                    </Grid>
                                    <Grid item={true} xs={6}>
                                        <Field name="price" validate={isRequiredAndIsNumber}>
                                            {({input, meta, ...rest}) => (
                                                <TextField
                                                    label="Цена"
                                                    margin="normal"
                                                    {...input}
                                                    {...rest}
                                                    error={!!getError(meta)}
                                                    helperText={getError(meta)}
                                                    fullWidth={true}
                                                    variant="outlined"
                                                />
                                            )}
                                        </Field>
                                    </Grid>
                                    <Grid item={true} xs={6}>
                                        <Field name="level" validate={isRequiredAndIsInteger}>
                                            {({input, meta, ...rest}) => (
                                                <TextField
                                                    label="Этаж"
                                                    margin="normal"
                                                    {...input}
                                                    {...rest}
                                                    error={!!getError(meta)}
                                                    helperText={getError(meta)}
                                                    fullWidth={true}
                                                    variant="outlined"
                                                />
                                            )}
                                        </Field>
                                    </Grid>
                                    <Grid item={true} xs={6}>
                                        <Field name="section" validate={isRequiredAndIsInteger}>
                                            {({input, meta, ...rest}) => (
                                                <TextField
                                                    label="Подъезд"
                                                    margin="normal"
                                                    {...input}
                                                    {...rest}
                                                    error={!!getError(meta)}
                                                    helperText={getError(meta)}
                                                    fullWidth={true}
                                                    variant="outlined"
                                                />
                                            )}
                                        </Field>
                                    </Grid>
                                    <Grid item={true} xs={6}>
                                        <Field name="area" validate={isRequiredAndIsNumber}>
                                            {({input, meta, ...rest}) => (
                                                <TextField
                                                    label="Площадь"
                                                    margin="normal"
                                                    {...input}
                                                    {...rest}
                                                    error={!!getError(meta)}
                                                    helperText={getError(meta)}
                                                    fullWidth={true}
                                                    variant="outlined"
                                                />
                                            )}
                                        </Field>
                                    </Grid>
                                    <Grid item={true} xs={6}>
                                        <Field name="status" validate={isRequired}>
                                            {({input, meta, ...rest}) => (
                                                <TextField
                                                    select={true}
                                                    label="Статус"
                                                    margin="normal"
                                                    {...input}
                                                    {...rest}
                                                    error={!!getError(meta)}
                                                    helperText={getError(meta)}
                                                    fullWidth={true}
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
                                    <Grid item={true} xs={6}>
                                        <Field name="roomAmount" validate={isRequiredAndIsInteger}>
                                            {({input, meta, ...rest}) => (
                                                <TextField
                                                    label="Количество комнат"
                                                    margin="normal"
                                                    {...input}
                                                    {...rest}
                                                    error={!!getError(meta)}
                                                    helperText={getError(meta)}
                                                    fullWidth={true}
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
                                <Button disabled={invalid} onClick={handleSave(values as Flat)} color="primary">
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
