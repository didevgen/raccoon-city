import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {Pannellum} from 'pannellum-react';
import React from 'react';
import styled from 'styled-components';
import {ImageType} from '../../../shared/types/apartmentComplex.types';

const panoramaProps = {
    haov: 180,
    minYaw: -90,
    maxYaw: 90
};

const EditorContainer = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: column;
`;

export function SidebarVRDialog({downloadLink, setOpen, open, mode, name}) {
    const additionalProps = mode === ImageType.HALF_VR ? panoramaProps : {};
    return (
        <Dialog open={open} aria-labelledby="form-dialog-title" fullWidth={true} maxWidth={'md'}>
            <DialogTitle id="form-dialog-title">{name}</DialogTitle>
            <DialogContent>
                <EditorContainer>
                    <div>
                        <Pannellum
                            width="100%"
                            height="500px"
                            image={downloadLink}
                            pitch={10}
                            yaw={180}
                            hfov={110}
                            autoLoad={true}
                            {...additionalProps}
                        />
                    </div>
                </EditorContainer>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={() => {
                        setOpen(false);
                    }}
                    color="primary"
                >
                    Закрыть
                </Button>
            </DialogActions>
        </Dialog>
    );
}
