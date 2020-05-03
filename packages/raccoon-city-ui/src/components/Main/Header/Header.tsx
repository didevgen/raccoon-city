import {Typography} from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import MenuIcon from '@material-ui/icons/Menu';
import clsx from 'clsx';
import React from 'react';
import {connect} from 'react-redux';

interface HeaderProps {
    open: boolean;
    drawerStyles: any;
    handleDrawerOpen: () => void;
}

export const Header = connect((state) => ({
    title: state.route.title
}))(({open, handleDrawerOpen, drawerStyles, title}: HeaderProps & any) => (
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
                <Typography variant="h6">{title}</Typography>
            </Toolbar>
        </AppBar>
    </div>
));
