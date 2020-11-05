import {useMutation, useQuery} from '@apollo/react-hooks';
import {Button, IconButton, MenuItem, Paper, TextField} from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {PhotoCamera} from '@material-ui/icons';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import arrayMutators from 'final-form-arrays';
import React, {ChangeEvent, Fragment, useEffect, useState} from 'react';
import {useDropzone} from 'react-dropzone';
import {Field, Form} from 'react-final-form';
import {FieldArray} from 'react-final-form-arrays';
import {connect} from 'react-redux';
import {Redirect, useParams} from 'react-router-dom';
import styled from 'styled-components';
import {CREATE_DEVELOPER, UPDATE_DEVELOPER} from '../../../graphql/mutations/developerMutaion';
import {DEVELOPER_DROPDOWNS, GET_DEVELOPER} from '../../../graphql/queries/developerQuery';
import {setRouteParams, setTitle} from '../../../redux/actions';
import {DropzoneContainer, StyledLink} from '../../shared/components/styled';
const FormBlock = styled.div`
    padding: 16px;
`;

const LogoInput = styled<any>(DropzoneContainer)`
    width: 320px;
    height: 320px;
    justify-content: center;
    .StyledDropzone__icon {
        width: 120px;
        height: 120px;
        .MuiSvgIcon-root {
            width: 96px;
            height: 96px;
        }
    }
`;

const LogoContainer = styled(Paper)`
    width: 320px;
    align-self: center;
`;

const Logo = styled.img`
    width: 320px;
`;

const LogoImageContainer = styled.div`
    position: relative;
`;

const LogoControls = styled.div`
    position: absolute;
    top: 0;
    right: 0;
`;

export function StyledDropzone(props: any) {
    const {getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject} = useDropzone({
        accept: 'image/*',
        onDrop: (acceptedFiles) => {
            props.onDrop(acceptedFiles[0]);
        }
    });

    return (
        <div className="container">
            <LogoInput {...getRootProps({isDragActive, isDragAccept, isDragReject})}>
                <input {...getInputProps()} />
                <IconButton
                    className="StyledDropzone__icon"
                    color="default"
                    aria-label="upload picture"
                    component="span"
                >
                    <PhotoCamera />
                </IconButton>
                <div>Лого застройщика</div>
            </LogoInput>
        </div>
    );
}

function LogoPreview({image, onDrop, onDelete}) {
    const {getRootProps, getInputProps} = useDropzone({
        accept: 'image/*',
        onDrop: (acceptedFiles) => {
            onDrop(acceptedFiles[0]);
        }
    });

    return (
        <LogoImageContainer>
            <Logo src={image} alt="logo" />
            <LogoControls>
                <span {...getRootProps()}>
                    <input {...getInputProps()} />
                    <IconButton color="primary" aria-label="add an alarm">
                        <EditIcon />
                    </IconButton>
                </span>
                <IconButton
                    color="secondary"
                    aria-label="add an alarm"
                    onClick={() => {
                        onDelete();
                    }}
                >
                    <DeleteIcon />
                </IconButton>
            </LogoControls>
        </LogoImageContainer>
    );
}

const required = (value: any) => (value ? undefined : 'Required');

function LogoComponent({setImage, logo}) {
    const [previewUrl, setPreviewUrl] = useState<any>(logo);

    const handleDrop = (dropped: any) => {
        setImage(dropped);
        const reader = new FileReader();
        reader.readAsDataURL(dropped);

        reader.onloadend = (e) => {
            setPreviewUrl(reader.result as string);
        };
    };

    return (
        <Grid item={true} xs={12} md={6}>
            <LogoContainer elevation={1}>
                {!previewUrl && <StyledDropzone onDrop={handleDrop} />}
                {previewUrl && (
                    <LogoPreview
                        image={previewUrl}
                        onDrop={handleDrop}
                        onDelete={() => {
                            setPreviewUrl(null);
                            setImage(null);
                        }}
                    />
                )}
            </LogoContainer>
        </Grid>
    );
}

export const DeveloperEditForm = connect(null, (dispatch) => ({
    applyParams: (params) => dispatch(setRouteParams(params)),
    applyTitle: (title) => dispatch(setTitle(title))
}))(({applyParams, applyTitle}) => {
    const params = useParams();

    useEffect(() => {
        applyParams(params);
        applyTitle('Редактирование застройщика');
    }, [params]); // eslint-disable-line
    const {developerUuid} = useParams();

    const {data, loading, error} = useQuery(GET_DEVELOPER, {
        variables: {
            uuid: developerUuid
        },
        fetchPolicy: 'cache-and-network'
    });
    const [updateDeveloper, {data: updateResult}] = useMutation(UPDATE_DEVELOPER);

    if (updateResult) {
        return <Redirect to="/developers" />;
    }

    if (loading) {
        return <span>Loading</span>;
    }

    if (error || !data) {
        return <span>Error</span>;
    }

    const {id, logo, __typename, ...initialValues} = data.getDeveloper;

    const onSubmit = async (values, image) => {
        await updateDeveloper({
            variables: {
                id: developerUuid,
                developerData: values,
                image
            }
        });
    };

    return (
        <DeveloperForm
            title={'Редактировать застройщика'}
            onSubmit={onSubmit}
            initialValues={initialValues}
            logo={logo?.downloadUrl}
        />
    );
});

export const DeveloperCreateForm = connect(null, (dispatch) => ({
    applyParams: (params) => dispatch(setRouteParams(params)),
    applyTitle: (title) => dispatch(setTitle(title))
}))(({applyParams, applyTitle}) => {
    const params = useParams();

    useEffect(() => {
        applyParams(params);
        applyTitle('Создание застройщика');
    }, [params]); // eslint-disable-line

    const [createDeveloper, {data: createResult}] = useMutation(CREATE_DEVELOPER);

    if (createResult) {
        return <Redirect to="/developers" />;
    }

    const initialValues = {
        emails: [''],
        receptionNumbers: [''],
        salesNumbers: ['']
    };

    const onSubmit = async (values, image) => {
        await createDeveloper({
            variables: {
                developerData: values,
                image
            }
        });
    };

    return <DeveloperForm title={'Создать застройщика'} onSubmit={onSubmit} initialValues={initialValues} />;
});

interface DeveloperFormProps {
    onSubmit: (values, image) => void;
    initialValues: any;
    title: string;
    logo?: string;
}
function DeveloperForm({onSubmit, initialValues, title, logo}: DeveloperFormProps) {
    const [image, setImage] = useState<any>();

    const {loading, error, data} = useQuery(DEVELOPER_DROPDOWNS);

    if (loading || error) {
        return null;
    }

    const {cities} = data;

    return (
        <Form
            onSubmit={(e) => {}}
            mutators={{
                ...arrayMutators
            }}
            initialValuesEqual={(a, b) => {
                return true;
            }}
            initialValues={initialValues}
        >
            {({values, invalid, form}) => {
                return (
                    <Fragment>
                        <Container maxWidth="md">
                            <Paper elevation={3}>
                                <FormBlock>
                                    <Typography variant="h5" gutterBottom={true}>
                                        {title}
                                    </Typography>
                                    <Grid container={true} spacing={3} direction="row-reverse">
                                        <LogoComponent setImage={setImage} logo={logo} />
                                        <Grid item={true} xs={12} md={6}>
                                            <Grid item={true} xs={12}>
                                                <Field name="name" validate={required}>
                                                    {(props) => (
                                                        <TextField
                                                            label="Название застройщика"
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
                                            <Grid item={true} xs={12}>
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
                                            <Grid item={true} xs={12}>
                                                <Field name="address" validate={required}>
                                                    {(props) => (
                                                        <TextField
                                                            label="Адрес"
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
                                            <FieldArray name="emails">
                                                {({fields}) =>
                                                    fields.map((name, index) => (
                                                        <Grid
                                                            container={true}
                                                            key={name}
                                                            justify="center"
                                                            alignItems="center"
                                                            alignContent="center"
                                                        >
                                                            <Grid item={true} xs={9}>
                                                                <Field name={name} validate={required}>
                                                                    {(props) => (
                                                                        <TextField
                                                                            label={`Электронная почта (${index + 1})`}
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
                                            <FieldArray name="receptionNumbers">
                                                {({fields}) =>
                                                    fields.map((name, index) => (
                                                        <Grid
                                                            container={true}
                                                            key={name}
                                                            justify="center"
                                                            alignItems="center"
                                                            alignContent="center"
                                                        >
                                                            <Grid item={true} xs={9}>
                                                                <Field name={name} validate={required}>
                                                                    {(props) => (
                                                                        <TextField
                                                                            label={`Номер приемной (${index + 1})`}
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
                                            <FieldArray name="salesNumbers">
                                                {({fields}) =>
                                                    fields.map((name, index) => (
                                                        <Grid
                                                            container={true}
                                                            key={name}
                                                            justify="center"
                                                            alignItems="center"
                                                            alignContent="center"
                                                        >
                                                            <Grid item={true} xs={9}>
                                                                <Field name={name} validate={required}>
                                                                    {(props) => (
                                                                        <TextField
                                                                            label={`Номер отдела продаж (${index + 1})`}
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
                                    </Grid>
                                    <StyledLink to="/developers">
                                        <Button variant="outlined">Отмена</Button>
                                    </StyledLink>
                                    <Button
                                        disabled={invalid}
                                        variant="contained"
                                        color="primary"
                                        onClick={() => {
                                            onSubmit(values, image);
                                        }}
                                    >
                                        Сохранить
                                    </Button>
                                </FormBlock>
                            </Paper>
                        </Container>
                    </Fragment>
                );
            }}
        </Form>
    );
}
