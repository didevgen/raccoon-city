import {useMutation, useQuery} from '@apollo/react-hooks';
import {Button} from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import {Fragment, useEffect} from 'react';
import {Field, Form} from 'react-final-form';
import {connect} from 'react-redux';
import {useParams} from 'react-router-dom';
import styled from 'styled-components';
import {isRequired} from '../../../core/validators/validators';
import {CONFIGURE_AMO} from '../../../graphql/mutations/developerMutaion';
import {CHECK_AMO} from '../../../graphql/queries/developerQuery';
import {setRouteParams, setTitle} from '../../../redux/actions';
import {StyledLink} from '../../shared/components/styled';

const FormContainer = styled.div`
    border: 1px solid #aaa;
`;

const FormBlock = styled.div`
    padding: 16px;
`;

export const AmoIntegration = connect(null, (dispatch) => ({
    applyParams: (params) => dispatch(setRouteParams(params)),
    applyTitle: (title) => dispatch(setTitle(title))
}))(({applyParams, applyTitle}) => {
    const params: any = useParams();

    useEffect(() => {
        applyParams(params);
        applyTitle('Настройка АМО');
    }, [params]); // eslint-disable-line

    const {data, error, loading} = useQuery(CHECK_AMO, {
        variables: {
            uuid: params.developerUuid
        }
    });
    const [configureAmo] = useMutation(CONFIGURE_AMO);

    if (error || loading) {
        return null;
    }

    if (data.checkAmo) {
        return <span>Интеграция настроена</span>;
    }

    return (
        <Container maxWidth="md">
            <FormContainer>
                <FormBlock>
                    <Typography variant="h5" gutterBottom={true}>
                        AmoCRM Интеграция
                    </Typography>
                    <Form onSubmit={(e) => {}}>
                        {({values, invalid, form}) => {
                            return (
                                <Fragment>
                                    <Field name="domain" validate={isRequired}>
                                        {(props) => (
                                            <TextField
                                                label="Домен"
                                                margin="normal"
                                                name={props.input.name}
                                                value={props.input.value}
                                                onChange={props.input.onChange}
                                                fullWidth={true}
                                                variant="outlined"
                                            />
                                        )}
                                    </Field>
                                    <Field name="secretKey" validate={isRequired}>
                                        {(props) => (
                                            <TextField
                                                label="Секретный ключ"
                                                margin="normal"
                                                type="password"
                                                name={props.input.name}
                                                value={props.input.value}
                                                onChange={props.input.onChange}
                                                fullWidth={true}
                                                variant="outlined"
                                            />
                                        )}
                                    </Field>
                                    <Field name="integrationId" validate={isRequired}>
                                        {(props) => (
                                            <TextField
                                                label="ID интеграции"
                                                margin="normal"
                                                name={props.input.name}
                                                value={props.input.value}
                                                onChange={props.input.onChange}
                                                fullWidth={true}
                                                variant="outlined"
                                            />
                                        )}
                                    </Field>
                                    <Field name="authCode" validate={isRequired}>
                                        {(props) => (
                                            <TextField
                                                label="Код авторизации"
                                                margin="normal"
                                                name={props.input.name}
                                                value={props.input.value}
                                                onChange={props.input.onChange}
                                                fullWidth={true}
                                                variant="outlined"
                                            />
                                        )}
                                    </Field>
                                    <Field name="redirectUrl" validate={isRequired}>
                                        {(props) => (
                                            <TextField
                                                label="Redirect URL"
                                                margin="normal"
                                                name={props.input.name}
                                                value={props.input.value}
                                                onChange={props.input.onChange}
                                                fullWidth={true}
                                                variant="outlined"
                                            />
                                        )}
                                    </Field>
                                    <Grid
                                        container={true}
                                        direction="row"
                                        spacing={2}
                                        justify="flex-end"
                                        alignItems="center"
                                    >
                                        <Grid justify="flex-end" container={true} item={true} xs={6}>
                                            <StyledLink to="/developers">
                                                <Button variant="outlined">Отмена</Button>
                                            </StyledLink>
                                            <Button
                                                disabled={invalid}
                                                variant="contained"
                                                color="primary"
                                                onClick={async () => {
                                                    await configureAmo({
                                                        variables: {
                                                            id: params.developerUuid,
                                                            amoConfig: values
                                                        },
                                                        refetchQueries: [
                                                            {
                                                                query: CHECK_AMO,
                                                                variables: {
                                                                    uuid: params.developerUuid
                                                                }
                                                            }
                                                        ]
                                                    });
                                                }}
                                            >
                                                Сохранить
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Fragment>
                            );
                        }}
                    </Form>
                </FormBlock>
            </FormContainer>
        </Container>
    );
});
