import {ApolloProvider} from '@apollo/react-hooks';
import DateFnsUtils from '@date-io/date-fns';
import {MuiPickersUtilsProvider} from '@material-ui/pickers';
import ruLocale from 'date-fns/locale/ru';
import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {Login} from './components/Authentication/Login/Login';
import {Main} from './components/Main/Main';
import {client} from './core/apollo/client';
const App: React.FC = () => {
    return (
        <ApolloProvider client={client}>
            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ruLocale}>
                <Router basename={process.env.PUBLIC_URL}>
                    <Switch>
                        <Route path="/login">
                            <Login />
                        </Route>
                        <Route path="/">
                            <Main />
                        </Route>
                    </Switch>
                </Router>
            </MuiPickersUtilsProvider>
        </ApolloProvider>
    );
};

export default App;
