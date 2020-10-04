import {useQuery} from '@apollo/react-hooks';
import {Grid, Slide} from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import {makeStyles} from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import React from 'react';
import {useParams} from 'react-router';
import styled from 'styled-components';
import {apartmentComplexDefaultImage} from '../../../../../../core/constants';
import {PUBLISHED_HOUSE_LIST} from '../../../../../../graphql/queries/houseQuery';
import {House} from '../../../../../shared/types/house.types';
import {FlatLayoutCard} from '../../../../LevelEditor/FlatLayoutSelectionDialog/FlatLayoutCard/FlatLayoutCard';

const useStyles = makeStyles((theme) => ({
    appBar: {
        position: 'relative'
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1
    }
}));

const LayoutContainer = styled.div`
    padding: 24px;
`;

const Transition = React.forwardRef((props: any, ref) => <Slide direction="up" ref={ref} {...props} />);

interface PublishedHouseSelectionDialogProps {
    open: boolean;
    setOpen: (value: boolean) => void;
    onLayoutSelected: (layout?: any) => void;
}

export function PublishedHouseSelectionDialog(props: PublishedHouseSelectionDialogProps) {
    const {apartmentComplexUuid} = useParams();
    const classes = useStyles();
    const {open, setOpen, onLayoutSelected} = props;

    const {loading, error, data} = useQuery(PUBLISHED_HOUSE_LIST, {
        variables: {
            uuid: apartmentComplexUuid
        },
        fetchPolicy: 'cache-and-network'
    });

    if (loading || error) {
        return null;
    }

    const handleClose = () => {
        onLayoutSelected();
        setOpen(false);
    };

    const handleSave = (house: any) => {
        onLayoutSelected(house);
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
                            Выбор опубликованных домов
                        </Typography>
                    </Toolbar>
                </AppBar>
                <LayoutContainer>
                    <Grid container={true} spacing={2}>
                        {data.getPublishedHouses.map((house: House) => {
                            return (
                                <Grid item={true} xs={12} md={3} key={house.id}>
                                    <FlatLayoutCard
                                        imageUrl={house.images?.CHESS_GRID?.downloadUrl || apartmentComplexDefaultImage}
                                        name={house.name}
                                        onSelect={() => {
                                            handleSave(house);
                                        }}
                                    />
                                </Grid>
                            );
                        })}
                    </Grid>
                </LayoutContainer>
            </Dialog>
        </div>
    );
}
