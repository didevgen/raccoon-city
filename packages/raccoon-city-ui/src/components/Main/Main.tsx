import {useMutation, useQuery} from '@apollo/react-hooks';
import CssBaseline from '@material-ui/core/CssBaseline';
import Cookies from 'js-cookie';
import React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import {client} from '../../core/apollo/client';
import {TOKEN} from '../../core/constants';
import {LOGOUT} from '../../graphql/mutations/authMutation';
import {GET_USER_INFO} from '../../graphql/queries/userQuery';
import {ApartmentComplexBuilder} from './ApartmentComplexBuilder/ApartmentComplexBuilder';
import {ApartmentComplexInfo} from './ApartmentComplexBuilder/ApartmentComplexInfo/ApartmentComplexInfo';
import {ApartmentComplexList} from './ApartmentComplexList/ApartmentComplexList';
import {ChessGrid} from './ChessGrid/ChessGrid';
import {useStyles} from './drawerStyles';
import {Header} from './Header/Header';
import {HouseBuilder} from './HouseBuilder/HouseBuilder';
import {HouseInfo} from './HouseBuilder/HouseInfo/HouseInfo';
import {Sidebar} from './Sidebar/Sidebar';

export function Main() {
    const {data} = useQuery(GET_USER_INFO);
    const [logout] = useMutation(LOGOUT);
    const [open, setOpen] = React.useState(false);
    const drawerStyles = useStyles();

    const onLogoutClick = () => {
        logout({
            variables: {key: Cookies.get(TOKEN)}
        }).then(() => {
            client.resetStore();
            Cookies.remove(TOKEN);
        });
    };
    return (
        <div className={drawerStyles.root}>
            <CssBaseline />
            <Header
                drawerStyles={drawerStyles}
                open={open}
                handleDrawerOpen={() => {
                    setOpen(true);
                }}
            />
            <Sidebar
                drawerStyles={drawerStyles}
                open={open}
                handleDrawerClose={() => {
                    setOpen(false);
                }}
            />
            <main className={drawerStyles.content}>
                <div className={drawerStyles.toolbar} />
                <Switch>
                    <Route exact={true} path="/">
                        <ApartmentComplexList />
                        {data && data.getUserInfo && (
                            <div>
                                <span>{`Hello, ${data.getUserInfo.name}`}</span>
                                <button onClick={onLogoutClick}>Log out</button>
                            </div>
                        )}
                    </Route>
                    <Route exact={true} path="/apartmentComplex/new">
                        <ApartmentComplexBuilder />
                    </Route>
                    <Route path="/apartmentComplex/:uuid/overview">
                        <ApartmentComplexInfo />
                    </Route>
                    <Route path="/apartmentComplex/:uuid/house/:houseUuid">
                        <HouseInfo />
                    </Route>
                    <Route path="/houseGrid/:houseUuid">
                        <ChessGrid />
                    </Route>
                    <Route exact={true} path="/apartmentComplex/:uuid/create/house">
                        <HouseBuilder />
                    </Route>
                    <Route path="*">
                        <ApartmentComplexList />
                    </Route>
                </Switch>
            </main>
        </div>
    );
}
