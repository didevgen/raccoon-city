import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import MenuIcon from '@material-ui/icons/Menu';
import clsx from 'clsx';
import React from 'react';
import {connect} from 'react-redux';
import styled from 'styled-components';
import {AppBreadcrumbs} from '../Breadcrumbs/AppBreadcrumbs';

const StyledAppBar = styled(AppBar)`
    &.MuiAppBar-colorPrimary {
        background-color: #37485c;
    }
`;

const FilterContainer = styled.div`
    margin-left: auto;
`;

interface HeaderProps {
    open: boolean;
    drawerStyles: any;
    handleDrawerOpen: () => void;
}

export const Header = connect((state) => ({
    title: state.route.title
}))(({open, handleDrawerOpen, drawerStyles}: HeaderProps & any) => (
    <div className={drawerStyles.root}>
        <StyledAppBar
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
                <AppBreadcrumbs />
                <FilterContainer id="chessGridFilterContainer" />
            </Toolbar>
        </StyledAppBar>
    </div>
));
