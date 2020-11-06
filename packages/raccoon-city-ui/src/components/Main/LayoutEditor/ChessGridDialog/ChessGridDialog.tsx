import {useMutation} from '@apollo/react-hooks';
import styled from 'styled-components';
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
import React, {useReducer, useContext} from 'react';
import {ASSIGN_FLATS_TO_LAYOUT} from '../../../../graphql/mutations/layoutMutation';
import {Flat} from '../../../shared/types/flat.types';
import {LayoutChessGrid} from '../../LayoutChessGrid/LayoutChessGrid';
import {reducer, getInitialState} from '../../ChessGrid/ChessGrid.reducer';
import {ViewMode} from '../../ChessGrid/ChessGridFilters/ChessGridFilters';
import {ViewModeValues} from '../../ChessGrid/ChessEnums';

const ViewModeContext = React.createContext({selectedViewMode: ViewModeValues.ROOM});
export const useSelectedViewMode = () => {
    return useContext(ViewModeContext);
};

const WrapperDiv = styled.div`
    display: flex;
`;

const useStyles = makeStyles((theme) => ({
    appBar: {
        position: 'relative',
        background: '#37485c'
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1
    }
}));

const Transition = React.forwardRef(function(props: any, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

interface ChessGridDialogProps {
    layoutId: string;
    refetch: (params?: any) => any;
}

export function ChessGridDialog(props: ChessGridDialogProps) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [dirty, setDirty] = React.useState(false);
    const [selection, setSelection] = React.useState<Flat[]>([]);
    const [assignFlats] = useMutation(ASSIGN_FLATS_TO_LAYOUT);
    const {layoutId} = props;

    const [state, dispatch] = useReducer(reducer, getInitialState(false));

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSave = async () => {
        await assignFlats({
            variables: {
                layoutId,
                flats: selection.map((flat) => flat.id)
            }
        });
        props.refetch();
        setOpen(false);
    };

    return (
        <div>
            <Link href="#" onClick={handleClickOpen}>
                <Button variant="outlined" color="primary">
                    Отметить квартиры
                </Button>
            </Link>
            <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition as any}>
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                            <CloseIcon />
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>
                            Отметить помещения
                        </Typography>
                        <Button variant="contained" disabled={!dirty} autoFocus color="secondary" onClick={handleSave}>
                            Сохранить
                        </Button>
                    </Toolbar>
                </AppBar>
                <WrapperDiv>
                    <ViewModeContext.Provider value={{selectedViewMode: state.selectedViewMode}}>
                        <LayoutChessGrid
                            onSelect={(flats) => {
                                setSelection(flats);
                                setDirty(true);
                            }}
                            layoutId={layoutId}
                        />
                        <ViewMode dispatch={dispatch} />
                    </ViewModeContext.Provider>
                </WrapperDiv>
            </Dialog>
        </div>
    );
}
