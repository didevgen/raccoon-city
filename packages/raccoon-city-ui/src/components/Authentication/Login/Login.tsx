import {useMutation} from '@apollo/react-hooks';
import Button from '@material-ui/core/Button';
import Cookies from 'js-cookie';
import * as React from 'react';
import {Form} from 'react-final-form';
import {Redirect} from 'react-router-dom';
import {TOKEN} from '../../../core/constants';
import {validateLoginForm} from '../../../core/validators/validators';
import {LOGIN} from '../../../graphql/mutations/authMutation';
import InputValidate from '../../InputValidate';
import {LoginForm, StyleForm} from './Login.styles';

export interface LoginFormInterface {
    email: string;
    password: string;
}

const initialValues: LoginFormInterface = {
    email: '',
    password: ''
};

export function Login() {
    const [login, {data, error}] = useMutation(LOGIN);
    const handleFormSubmit = async (formObj: any) => {
        await login({
            variables: {email: formObj.email, password: formObj.password}
        }).catch(() => {});
    };

    if (data) {
        Cookies.set(TOKEN, data.login.token, {expires: 1});
        return <Redirect to="/" />;
    }
    return (
        <LoginForm>
            <Form
                onSubmit={(formObj: LoginFormInterface) => {
                    handleFormSubmit(formObj);
                }}
                initialValues={initialValues}
                validate={(values: LoginFormInterface) => {
                    return validateLoginForm(values);
                }}
                render={({handleSubmit}) => (
                    <StyleForm>
                        <InputValidate id="email" label="Email" variant="outlined" fieldName="email" type="email" />
                        <InputValidate
                            id="password"
                            label="Пароль"
                            variant="outlined"
                            fieldName="password"
                            type="password"
                        />
                        {error && <div>Неправильное имя пользователя или пароль</div>}
                        <Button type="submit" variant="outlined" color="primary" onClick={handleSubmit}>
                            Войти
                        </Button>
                    </StyleForm>
                )}
            />
        </LoginForm>
    );
}
