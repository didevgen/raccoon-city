import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import Cookies from 'js-cookie';
import React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import styled from 'styled-components';
import {API_TOKEN} from '../../core/constants';
import {ChessGrid} from '../Main/ChessGrid/ChessGrid';
import {useStyles} from '../Main/drawerStyles';

const Content = styled.div`
    position: relative;
    max-width: 100%;
    overflow-y: scroll;

    .ChessGridColumn__cell {
        flex-direction: column-reverse;
    }
`;
const FilterContainer = styled.div`
    margin-left: auto;
`;
const StyledAppBar = styled(AppBar)`
    &.MuiAppBar-colorPrimary {
        background-color: #37485c;
    }
`;

export function Public() {
    const drawerStyles = useStyles();
    const params = new URLSearchParams(window.location.search);
    const authToken = params.get('authToken');
    if (authToken) {
        Cookies.set(API_TOKEN, authToken, {expires: 365, sameSite: 'none'});
    } else {
        return <Redirect to="/login" />;
    }
    return (
        <div className={drawerStyles.root}>
            <CssBaseline />
            <div className={drawerStyles.root}>
                <StyledAppBar position="fixed">
                    <Toolbar>
                        <FilterContainer id="chessGridFilterContainer" />
                    </Toolbar>
                </StyledAppBar>
            </div>
            <Content className={drawerStyles.content}>
                <div className={drawerStyles.toolbar} />
                <Switch>
                    <Route exact={true} path="/public/developers/:developerUuid/chessgrid">
                        <ChessGrid hasSelect isPublic />
                    </Route>
                    <Route
                        exact={true}
                        path="/public/developers/:developerUuid/apartmentComplex/:apartmentComplexUuid/houseGrid/:houseUuid"
                    >
                        <ChessGrid isPublic />
                    </Route>
                </Switch>
            </Content>
        </div>
    );
}

export default Public;
