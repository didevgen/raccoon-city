import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {Main} from './components/Main/Main';
import {Login} from './components/Authentication/Login/Login';

const App: React.FC = () => {
    return (
        <Router>
            <Switch>
                <Route path="/">
                    <Main />
                </Route>
                <Route path="/login">
                    <Login />
                </Route>
            </Switch>
        </Router>
    );
};

export default App;
