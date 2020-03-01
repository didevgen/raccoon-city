import {DialogContentText} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import React, {Fragment, useState} from 'react';
import styled from 'styled-components';
import {HouseLayout} from '../../../shared/types/layout.types';
import {LevelFlatLayout} from '../../../shared/types/level.types';
import {FlatLayoutSelectionDialog} from '../FlatLayoutSelectionDialog/FlatLayoutSelectionDialog';

const LayoutImage = styled.img`
    width: 100%;
`;

interface FlatLayoutPreviewDialogProps {
    open: boolean;
    setOpen: (value: boolean) => void;
    flatLayout: LevelFlatLayout;
}

interface AssignedLayoutContentProps {
    flatLayout: LevelFlatLayout;
}

function AssignedLayoutContent(props: AssignedLayoutContentProps) {
    const {flatLayout} = props;
    return (
        <Fragment>
            <DialogTitle id="alert-dialog-title">{flatLayout.flatLayout.name}</DialogTitle>
            <DialogContent>
                <LayoutImage src={flatLayout.flatLayout.image.previewImageUrl} />
            </DialogContent>
        </Fragment>
    );
}

function NotAssignedLayoutContent() {
    const [isHouseLayoutsOpen, setHouseLayoutsDialogState] = useState(false);
    return (
        <Fragment>
            <DialogTitle id="alert-dialog-title">Привязать планировку</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    У данной области отсутствует привязанная планировка.
                </DialogContentText>
                <Button
                    variant="contained"
                    onClick={() => {
                        setHouseLayoutsDialogState(true);
                    }}
                    color="primary"
                >
                    Выбрать планировку
                </Button>
            </DialogContent>
            <FlatLayoutSelectionDialog
                open={isHouseLayoutsOpen}
                setOpen={setHouseLayoutsDialogState}
                onLayoutSelected={async (layout?: HouseLayout) => {
                    console.log(layout);
                }}
            />
        </Fragment>
    );
}
export function FlatLayoutPreviewDialog(props: FlatLayoutPreviewDialogProps) {
    const {open, setOpen, flatLayout} = props;
    const hasLayout = !!flatLayout.flatLayout;
    return (
        <div>
            <Dialog
                open={open}
                onClose={() => {
                    setOpen(false);
                }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                {hasLayout && <AssignedLayoutContent flatLayout={flatLayout} />}
                {!hasLayout && <NotAssignedLayoutContent />}
                <DialogActions>
                    <Button
                        variant="outlined"
                        onClick={() => {
                            setOpen(false);
                        }}
                        color="primary"
                    >
                        Отмена
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={() => {
                            setOpen(false);
                        }}
                        color="secondary"
                    >
                        Удалить область
                    </Button>
                    {hasLayout && (
                        <Button
                            variant="outlined"
                            onClick={() => {
                                setOpen(false);
                            }}
                            color="secondary"
                        >
                            Отвязать планировку
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </div>
    );
}
