import CssBaseline from '@material-ui/core/CssBaseline';
import React from 'react';
import {Route, Switch} from 'react-router-dom';
import {ApartmentComplexBuilder} from './ApartmentComplexBuilder/ApartmentComplexBuilder';
import {ApartmentComplexList} from './ApartmentComplexList/ApartmentComplexList';
import {useStyles} from './drawerStyles';
import {Header} from './Header/Header';
import {Sidebar} from './Sidebar/Sidebar';
import {ApartmentComplexInfo} from './ApartmentComplexBuilder/ApartmentComplexInfo/ApartmentComplexInfo';
import {HouseBuilder} from './HouseBuilder/HouseBuilder';

export function Main() {
    const [open, setOpen] = React.useState(false);
    const drawerStyles = useStyles();

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
                    </Route>
                    <Route exact={true} path="/apartmentComplex/new">
                        <ApartmentComplexBuilder />
                    </Route>
                    <Route path="/apartmentComplex/:uuid/overview">
                        <ApartmentComplexInfo />
                    </Route>
                    <Route exact={true} path="/apartmentComplex/:uuid/house/new">
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
