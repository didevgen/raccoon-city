import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import {Header} from './Header/Header';
import {Sidebar} from './Sidebar/Sidebar';
import {useStyles} from './drawerStyles';

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
                <h1>Main</h1>
            </main>
        </div>
    );
}
