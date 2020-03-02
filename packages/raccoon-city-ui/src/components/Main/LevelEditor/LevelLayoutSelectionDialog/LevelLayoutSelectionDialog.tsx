import {useQuery} from '@apollo/react-hooks';
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
import {GET_LEVEL_LAYOUT_FLAT_LAYOUTS} from '../../../../graphql/queries/levelQuery';
import {LevelLayout} from '../../../shared/types/layout.types';
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
    layout: LevelLayout;
}
export function LevelLayoutSelectionDialog(props: LevelLayoutSelectionDialogProps) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);

    const {data, loading, error, refetch} = useQuery(GET_LEVEL_LAYOUT_FLAT_LAYOUTS, {
        variables: {
            levelLayoutId: props.layout.id
        },
        fetchPolicy: 'cache-and-network'
    });
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const isLoading = loading || error;
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
                {!isLoading && (
                    <LevelLayoutSelection
                        imageUrl={props.layout.image.downloadUrl}
                        levelLayoutId={props.layout.id}
                        flatLayouts={data.getLevelLayoutFlatLayouts}
                        refetchLayouts={refetch}
                    />
                )}
            </Dialog>
        </div>
    );
}
