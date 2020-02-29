import {Slide} from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import {makeStyles} from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import React from 'react';
import {HouseLayout} from '../../../shared/types/layout.types';
import {FlatLayoutSelectionList} from './FlatLayoutSelectionList/FlatLayoutSelectionList';

const useStyles = makeStyles((theme) => ({
    appBar: {
        position: 'relative'
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1
    }
}));

const Transition = React.forwardRef(function(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

interface HouseLayoutSelectionDialogProps {
    open: boolean;
    setOpen: (value: boolean) => void;
    onLayoutSelected: (layout: HouseLayout) => void;
}

export function FlatLayoutSelectionDialog(props: HouseLayoutSelectionDialogProps) {
    const classes = useStyles();
    const {open, setOpen, onLayoutSelected} = props;

    const handleClose = () => {
        setOpen(false);
    };

    const handleSave = async (layout: HouseLayout) => {
        onLayoutSelected(layout);
        setOpen(false);
    };

    return (
        <div>
            <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition as any}>
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                            <CloseIcon />
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>
                            Выбор этажей
                        </Typography>
                    </Toolbar>
                </AppBar>
                <FlatLayoutSelectionList onSelect={handleSave} />
            </Dialog>
        </div>
    );
}
