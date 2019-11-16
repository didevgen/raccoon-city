import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import clsx from 'clsx';

interface HeaderProps {
    open: boolean;
    drawerStyles: any;
    handleDrawerOpen: () => void;
}
export function Header({open, handleDrawerOpen, drawerStyles}: HeaderProps) {
    return (
        <div className={drawerStyles.root}>
            <AppBar
                position="fixed"
                className={clsx(drawerStyles.appBar, {
                    [drawerStyles.appBarShift]: open
                })}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        className={clsx(drawerStyles.menuButton, {
                            [drawerStyles.hide]: open
                        })}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap>
                        Mini variant drawer
                    </Typography>
                </Toolbar>
            </AppBar>
        </div>
    );
}
