import {useMutation} from '@apollo/react-hooks';
import Button from '@material-ui/core/Button';
import Cookies from 'js-cookie';
import * as React from 'react';
import {Form} from 'react-final-form';
import styled from 'styled-components';
import {validateLoginForm} from '../../../core/validators/validators';
import {LOGIN} from '../../../graphql/mutations/authMutation';
import InputValidate from '../../InputValidate';
import {LoginForm} from './Login.styles';

export interface LoginFormInterface {
    email: string;
    password: string;
}

const initialValues: LoginFormInterface = {
    email: '',
    password: ''
};

const StyleForm = styled.form`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
`;
export function Login() {
    const [login, {data}] = useMutation(LOGIN);

    const handleFormSubmit = (formObj: any) => {
        login({
            variables: {email: formObj.email, password: formObj.password}
        });
    };
    if (data) {
        Cookies.set('token', data.login.token, {expires: 1 / 24});
        return <h1>You are successfully login!</h1>;
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
                    <StyleForm
                        onSubmit={(e: React.ChangeEvent<{}>) => {
                            e.preventDefault();
                            handleSubmit();
                        }}
                    >
                        <InputValidate id="email" label="Email" variant="outlined" fieldName="email" type="email" />
                        <InputValidate
                            id="password"
                            label="Password"
                            variant="outlined"
                            fieldName="password"
                            type="password"
                        />
                        <Button type="submit" variant="outlined" color="primary">
                            Login
                        </Button>
                    </StyleForm>
                )}
            />
        </LoginForm>
    );
}
