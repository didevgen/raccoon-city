import {useMutation} from '@apollo/react-hooks';
import * as React from 'react';
import {LOGIN} from '../../../graphql/mutations/authMutation';

export function Login() {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [login, {data}] = useMutation(LOGIN);

    const onSubmitForm = () => {
        login({
            variables: {email, password}
        });
    };
    if (data) {
        return <h1>You are successfully login!</h1>;
    }
    return (
        <form
            onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                onSubmitForm();
            }}
        >
            <input
                type="email"
                value={email}
                name="email"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            />
            <input
                type="password"
                value={password}
                name="password"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            />
            <button type="submit">Login</button>
        </form>
    );
}
