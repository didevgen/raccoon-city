import {useQuery} from '@apollo/react-hooks';
import CssBaseline from '@material-ui/core/CssBaseline';
import React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import {GET_USER_INFO} from '../../graphql/queries/userQuery';
import {
    ApartmentComplexCreateForm,
    ApartmentComplexEditForm
} from './ApartmentComplexBuilder/ApartmentComplexForm/ApartmentComplexForm';
import {ApartmentComplexInfo} from './ApartmentComplexBuilder/ApartmentComplexInfo/ApartmentComplexInfo';
import {ApartmentComplexList} from './ApartmentComplexList/ApartmentComplexList';
import {ChessGrid} from './ChessGrid/ChessGrid';
import {DeveloperCreateForm, DeveloperEditForm} from './Developer/DeveloperForm';
import {DeveloperList} from './Developer/DeveloperList';
import {useStyles} from './drawerStyles';
import {Header} from './Header/Header';
import {HouseCreateForm, HouseEditForm} from './HouseBuilder/HouseForm/HouseForm';
import {HouseInfo} from './HouseBuilder/HouseInfo/HouseInfo';
import {MainChessGrid} from './MainChessGrid/MainChessGrid';
import {Sidebar} from './Sidebar/Sidebar';
import {UserList} from './Users/UserList';

export function Main() {
    const {data, loading} = useQuery(GET_USER_INFO);
    // const [logout] = useMutation(LOGOUT);
    const [open, setOpen] = React.useState(false);
    const drawerStyles = useStyles();

    // const onLogoutClick = () => {
    //     logout({
    //         variables: {key: Cookies.get(TOKEN)}
    //     }).then(() => {
    //         client.resetStore();
    //         Cookies.remove(TOKEN);
    //     });
    // };
    if (loading) {
        return <span>Loading...</span>;
    }

    if (!data || !data.getUserInfo) {
        return <Redirect to="/login" />;
    }
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
                    <Route exact={true} path="/developers/:developerUuid/apartmentComplexes">
                        <ApartmentComplexList />
                    </Route>
                    <Route exact={true} path="/developers/:developerUuid/chessgrid">
                        <MainChessGrid />
                    </Route>
                    <Route exact={true} path="/users">
                        <UserList />
                    </Route>
                    <Route exact={true} path="/developers">
                        <DeveloperList />
                    </Route>
                    <Route exact={true} path="/developer/new">
                        <DeveloperCreateForm />
                    </Route>
                    <Route exact={true} path="/developer/:developerUuid/edit">
                        <DeveloperEditForm />
                    </Route>
                    <Route exact={true} path="/developers/:developerUuid/apartmentComplex/new">
                        <ApartmentComplexCreateForm />
                    </Route>
                    <Route exact={true} path="/developers/:developerUuid/apartmentComplex/:apartmentComplexUuid/edit">
                        <ApartmentComplexEditForm />
                    </Route>
                    <Route path="/developers/:developerUuid/apartmentComplex/:apartmentComplexUuid/overview">
                        <ApartmentComplexInfo />
                    </Route>
                    <Route path="/developers/:developerUuid/apartmentComplex/:apartmentComplexUuid/house/:houseUuid">
                        <HouseInfo />
                    </Route>
                    <Route path="/developers/:developerUuid/houseGrid/:houseUuid">
                        <ChessGrid />
                    </Route>
                    <Route
                        exact={true}
                        path="/developers/:developerUuid/apartmentComplex/:apartmentComplexUuid/create/house"
                    >
                        <HouseCreateForm />
                    </Route>
                    <Route
                        exact={true}
                        path="/developers/:developerUuid/apartmentComplex/:apartmentComplexUuid/houseEdit/:houseUuid"
                    >
                        <HouseEditForm />
                    </Route>
                    <Route path="*">
                        <DeveloperList />
                    </Route>
                </Switch>
            </main>
        </div>
    );
}
