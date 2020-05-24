import React from 'react';
import {ApolloProvider} from '@apollo/react-hooks';
import './App.css';
import {client} from './core/apollo/client';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {ChessGrid} from './components/ChessGrid/ChessGrid';

function App() {
  return (
      <ApolloProvider client={client}>
            <Router basename={process.env.PUBLIC_URL}>
              <Switch>
                <Route path="/chessGrid/:developerUuid">
                    <ChessGrid hasSelect/>
                </Route>
              </Switch>
            </Router>
      </ApolloProvider>
  );
}

export default App;
