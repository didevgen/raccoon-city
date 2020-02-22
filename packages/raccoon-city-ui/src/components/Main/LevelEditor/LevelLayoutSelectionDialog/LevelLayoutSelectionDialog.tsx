import {Slide} from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import {makeStyles} from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import React from 'react';
import {HouseLayout} from '../../../shared/types/layout.types';
import {LevelLayoutSelection} from './LevelLayoutSelection';

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

interface LevelLayoutSelectionDialogProps {
    layout: HouseLayout;
}
export function LevelLayoutSelectionDialog(props: LevelLayoutSelectionDialogProps) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Link href="#" onClick={handleClickOpen}>
                Отметить планировки
            </Link>
            <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition as any}>
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                            <CloseIcon />
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>
                            Выбор планировок
                        </Typography>
                        <Button autoFocus color="inherit" onClick={handleClose}>
                            Сохранить
                        </Button>
                    </Toolbar>
                </AppBar>
                <LevelLayoutSelection imageUrl={props.layout.image.downloadUrl} />
            </Dialog>
        </div>
    );
}
