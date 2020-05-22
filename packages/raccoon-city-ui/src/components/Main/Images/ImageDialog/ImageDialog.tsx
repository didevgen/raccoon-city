import {MutationTuple} from '@apollo/react-hooks/lib/types';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';
import 'cropperjs/dist/cropper.css';
import React, {Fragment, useState} from 'react';
import Cropper from 'react-cropper';
import styled from 'styled-components';
import {StyledDropzone} from '../../../shared/components/dropzone/Dropzone';
import {ImageType} from '../../../shared/types/apartmentComplex.types';

const EditorContainer = styled.div`
    display: flex;
    justify-content: center;
`;
const blobToFile = (theBlob: Blob, fileName: string): File => {
    return new File([theBlob], fileName);
};

export interface ImageDialogProps {
    setOpen: (state: boolean) => void;
    open: boolean;
    params: {
        uuid: string;
        mode: ImageType;
    };
    mutation: MutationTuple<any, any>;
}

export function ImageDialog({setOpen, open, params, mutation}: ImageDialogProps) {
    const [image, setImage] = useState<any>();

    const {uuid, mode} = params;

    const [uploadFile, {loading}] = mutation;
    const editor = React.createRef<any>();

    const handleClose = () => {
        setImage(undefined);
        setOpen(false);
    };

    const handleDrop = (dropped: any) => {
        const reader = new FileReader();
        reader.onload = () => {
            setImage(reader.result);
        };
        reader.readAsDataURL(dropped);
    };

    const onSave = async () => {
        if (editor) {
            const canvasScaled = editor.current.getCroppedCanvas();
            const blob = await fetch(canvasScaled.toDataURL()).then((res) => res.blob());
            const file = blobToFile(blob, image?.name);
            await uploadFile({
                variables: {
                    file,
                    uuid,
                    mode
                }
            });
            handleClose();
        }
    };
    return (
        <Dialog open={open} aria-labelledby="form-dialog-title" fullWidth={true} maxWidth={'md'}>
            <DialogTitle id="form-dialog-title">Добавить изображение</DialogTitle>
            <DialogContent>
                {!image && <StyledDropzone onDrop={handleDrop} />}
                {image && (
                    <Fragment>
                        <EditorContainer>
                            <Cropper
                                dragMode={'move'}
                                src={image}
                                ready={() => {
                                    editor.current.zoomTo(1);
                                }}
                                style={{height: 400, width: '100%'}}
                                aspectRatio={16 / 9}
                                preview=".img-preview"
                                ref={editor}
                            />
                        </EditorContainer>
                        <div>
                            <Typography id="discrete-slider" gutterBottom={true}>
                                Размер
                            </Typography>
                            <Slider
                                defaultValue={1}
                                onChange={(e, value: any) => {
                                    editor.current.zoomTo(value);
                                }}
                                aria-labelledby="discrete-slider"
                                valueLabelDisplay="auto"
                                step={0.1}
                                marks={true}
                                min={0.1}
                                max={3}
                            />
                        </div>
                        <div>
                            <Typography id="discrete-slider" gutterBottom={true}>
                                Выровнять
                            </Typography>
                            <Slider
                                defaultValue={1}
                                onChange={(e, value: any) => {
                                    editor.current.rotateTo(value);
                                }}
                                aria-labelledby="discrete-slider"
                                valueLabelDisplay="auto"
                                step={1}
                                marks={true}
                                min={0}
                                max={360}
                            />
                        </div>
                    </Fragment>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Отмена
                </Button>
                <Button variant="contained" disabled={!image} onClick={onSave} color="primary">
                    {loading && <CircularProgress size={30} thickness={5} />}
                    Сохранить
                </Button>
            </DialogActions>
        </Dialog>
    );
}
