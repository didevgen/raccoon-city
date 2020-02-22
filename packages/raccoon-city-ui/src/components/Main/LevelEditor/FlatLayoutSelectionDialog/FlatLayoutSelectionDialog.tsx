import {Slide} from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import {makeStyles} from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import React from 'react';
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
}

export function FlatLayoutSelectionDialog(props: HouseLayoutSelectionDialogProps) {
    const classes = useStyles();
    const {open, setOpen} = props;

    const handleClose = () => {
        setOpen(false);
    };

    const handleSave = async () => {};

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
                        <Button autoFocus color="inherit" onClick={handleSave}>
                            Сохранить
                        </Button>
                    </Toolbar>
                </AppBar>
                <FlatLayoutSelectionList />
            </Dialog>
        </div>
    );
}
