import {ApolloProvider} from '@apollo/react-hooks';
import DateFnsUtils from '@date-io/date-fns';
import {MuiPickersUtilsProvider} from '@material-ui/pickers';
import ruLocale from 'date-fns/locale/ru';
import React from 'react';
import {Provider} from 'react-redux';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {createStore} from 'redux';
import {Login} from './components/Authentication/Login/Login';
import {Main} from './components/Main/Main';
import {client} from './core/apollo/client';
import rootReducer from './redux/reducers/rootReducer';

const store = createStore(rootReducer);
const App: React.FC = () => {
    return (
        <ApolloProvider client={client}>
            <Provider store={store}>
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
            </Provider>
        </ApolloProvider>
    );
};

export default App;
