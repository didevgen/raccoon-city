import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
// @ts-ignore
import {Pannellum} from 'pannellum-react';
import React, {Fragment, useState} from 'react';
import styled from 'styled-components';
import {StyledDropzone} from '../../../../shared/components/dropzone/Dropzone';

const EditorContainer = styled.div`
    display: flex;
    justify-content: center;
`;

export interface ImageDialogProps {
    setOpen: (state: boolean) => void;
    open: boolean;
}

export function VRDialog({setOpen, open}: ImageDialogProps) {
    const [image, setImage] = useState();

    const handleClose = () => {
        setImage(undefined);
        setOpen(false);
    };

    const handleDrop = (dropped: any) => {
        setImage(dropped);
    };

    const onSave = async () => {};

    return (
        <Dialog open={open} aria-labelledby="form-dialog-title" fullWidth={true} maxWidth={'md'}>
            <DialogTitle id="form-dialog-title">Добавить изображение</DialogTitle>
            <DialogContent>
                {!image && <StyledDropzone onDrop={handleDrop} />}
                {image && (
                    <Fragment>
                        <EditorContainer>
                            <Pannellum
                                width="100%"
                                height="500px"
                                image={
                                    'https://firebasestorage.googleapis.com/v0/b/raccoon-city-74eff.appspot.com/o/%D0%A1%D0%A3_360.jpg?alt=media&token=bad8197f-441b-4832-a117-39f7ff1e9733'
                                }
                                pitch={10}
                                yaw={180}
                                hfov={110}
                                autoLoad={true}
                                onLoad={() => {
                                    console.log('panorama loaded');
                                }}
                            />
                        </EditorContainer>
                    </Fragment>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Отмена
                </Button>
                <Button disabled={!image} onClick={onSave} color="primary">
                    Сохранить
                </Button>
            </DialogActions>
        </Dialog>
    );
}
