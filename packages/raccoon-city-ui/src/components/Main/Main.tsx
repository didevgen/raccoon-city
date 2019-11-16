import React from 'react';
import {Route, Switch} from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import {Header} from './Header/Header';
import {Sidebar} from './Sidebar/Sidebar';
import {useStyles} from './drawerStyles';
import {ApartmentComplexList} from './ApartmentComplexList/ApartmentComplexList';

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
                    <Route exact path="/">
                        <ApartmentComplexList />
                    </Route>
                </Switch>
            </main>
        </div>
    );
}
