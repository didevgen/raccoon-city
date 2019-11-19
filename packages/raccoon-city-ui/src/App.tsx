import {ApolloProvider} from '@apollo/react-hooks';
import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {Login} from './components/Authentication/Login/Login';
import {Main} from './components/Main/Main';
import {client} from './core/apollo/client';

const App: React.FC = () => {
    return (
        <ApolloProvider client={client}>
            <Router basename={'/raccoon-city'}>
                <Switch>
                    <Route path="/">
                        <Main />
                    </Route>
                    <Route path="/login">
                        <Login />
                    </Route>
                </Switch>
            </Router>
        </ApolloProvider>
    );
};

export default App;
