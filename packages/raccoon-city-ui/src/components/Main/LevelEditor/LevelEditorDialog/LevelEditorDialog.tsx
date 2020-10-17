import {useMutation} from '@apollo/react-hooks';
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
import {ASSIGN_LEVELS_TO_LAYOUT} from '../../../../graphql/mutations/layoutMutation';
import {Level} from '../../../shared/types/level.types';
import {LevelChessGrid} from '../../LevelChessGrid/LevelChessGrid';

const useStyles = makeStyles((theme) => ({
    appBar: {
        position: 'relative'
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1
    }
}));

const Transition = React.forwardRef(function(props: any, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

interface LevelEditorDialogProps {
    layoutId: string;
    refetch: (params?: any) => any;
}

export function LevelEditorDialog(props: LevelEditorDialogProps) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [dirty, setDirty] = React.useState(false);
    const [selection, setSelection] = React.useState<Level[]>([]);
    const [assignLevels] = useMutation(ASSIGN_LEVELS_TO_LAYOUT);
    const {layoutId} = props;
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSave = async () => {
        await assignLevels({
            variables: {
                levelLayoutId: layoutId,
                levels: selection.map((level) => level.id)
            }
        });
        setOpen(false);
    };

    return (
        <div>
            <Link href="#" onClick={handleClickOpen}>
                Отметить этажи
            </Link>
            <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition as any}>
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                            <CloseIcon />
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>
                            Выбор этажей
                        </Typography>
                        <Button disabled={!dirty} autoFocus color="secondary" variant="contained" onClick={handleSave}>
                            Сохранить
                        </Button>
                    </Toolbar>
                </AppBar>
                <LevelChessGrid
                    levelLayoutId={layoutId}
                    onSelect={(levels) => {
                        setSelection(levels);
                        setDirty(true);
                    }}
                />
            </Dialog>
        </div>
    );
}
