import {useMutation} from '@apollo/react-hooks';
import {Slide} from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import {makeStyles} from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import React, {Fragment, useState} from 'react';
import {useParams} from 'react-router-dom';
import {ASSIGN_HOUSE_TO_APARTMENT_COMPLEX_LAYOUT} from '../../../../../../graphql/mutations/layoutMutation';
import {GET_APARTMENT_COMPLEX_LAYOUTS} from '../../../../../../graphql/queries/layoutQuery';
import {ApartmentComplexLayout} from '../../../../../shared/types/layout.types';
import {PublishedHouseSelectionDialog} from '../PublishedHouseSelectionDialog/PublishedHouseSelectionDialog';
import {LayoutSelection} from './LayoutSelection';

const useStyles = makeStyles((theme) => ({
    appBar: {
        position: 'relative'
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1
    }
}));

const Transition = React.forwardRef((props: any, ref) => <Slide direction="up" ref={ref} {...props} />);

interface ApartmentComplexLayoutSelectionDialogProps {
    imageUrl: any;
    uuid: string;
    layout: ApartmentComplexLayout;
}

export function ApartmentComplexLayoutSelectionDialog(props: ApartmentComplexLayoutSelectionDialogProps) {
    const classes = useStyles();
    const {apartmentComplexUuid} = useParams();
    const [open, setOpen] = React.useState(false);
    const [houseDialogOpen, setHouseDialogOpen] = useState(false);
    const [selectionProps, setSelectionProps] = useState<any>({});
    const [assignHouse] = useMutation(ASSIGN_HOUSE_TO_APARTMENT_COMPLEX_LAYOUT);
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Fragment>
            <div
                onClick={() => {
                    handleClickOpen();
                }}
            >
                Отметить дома
            </div>
            <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition as any}>
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                            <CloseIcon />
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>
                            Выделение опубликованных домов
                        </Typography>
                    </Toolbar>
                </AppBar>
                <LayoutSelection
                    imageUrl={props.imageUrl}
                    layouts={props.layout.layouts}
                    onPathClosed={(path, imageSize) => {
                        setHouseDialogOpen(true);
                        setSelectionProps({path, imageSize});
                    }}
                    onLayoutSelected={() => {}}
                />
                <PublishedHouseSelectionDialog
                    onLayoutSelected={async (house) => {
                        setHouseDialogOpen(false);
                        if (house) {
                            const {imageSize, path} = selectionProps;
                            await assignHouse({
                                variables: {
                                    layoutId: props.uuid,
                                    houseId: house.id,
                                    viewBox: {
                                        width: imageSize.width,
                                        height: imageSize.height
                                    },
                                    path: JSON.stringify(path?.array().flat())
                                },
                                refetchQueries: [
                                    {
                                        query: GET_APARTMENT_COMPLEX_LAYOUTS,
                                        variables: {
                                            uuid: apartmentComplexUuid
                                        }
                                    }
                                ]
                            });
                        }
                    }}
                    open={houseDialogOpen}
                    setOpen={setHouseDialogOpen}
                />
            </Dialog>
        </Fragment>
    );
}
