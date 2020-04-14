import {useTheme} from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ChevronRightIcon from '@material-ui/core/SvgIcon/SvgIcon';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import MailIcon from '@material-ui/icons/Mail';
import clsx from 'clsx';
import * as React from 'react';
import {StyledLink} from '../../shared/components/styled';

interface SidebarProps {
    open: boolean;
    drawerStyles: any;
    handleDrawerClose: () => void;
}

export function Sidebar({open, handleDrawerClose, drawerStyles}: SidebarProps) {
    const theme = useTheme();

    return (
        <Drawer
            variant="permanent"
            className={clsx(drawerStyles.drawer, {
                [drawerStyles.drawerOpen]: open,
                [drawerStyles.drawerClose]: !open
            })}
            classes={{
                paper: clsx({
                    [drawerStyles.drawerOpen]: open,
                    [drawerStyles.drawerClose]: !open
                })
            }}
            open={open}
        >
            <div className={drawerStyles.toolbar}>
                <IconButton onClick={handleDrawerClose}>
                    {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                </IconButton>
            </div>
            <Divider />
            <List>
                <StyledLink to="/">
                    <ListItem button>
                        <ListItemIcon>{<MailIcon />}</ListItemIcon>
                        <ListItemText primary="Комплексы" />
                    </ListItem>
                </StyledLink>
            </List>
            <Divider />
        </Drawer>
    );
}
