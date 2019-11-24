import {useMutation} from '@apollo/react-hooks';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';
import React, {Fragment, useState} from 'react';
import AvatarEditor from 'react-avatar-editor';
import {UPLOAD_FILE} from '../../../../../graphql/mutations/apartmentComplexMutation';
import {StyledDropzone} from '../../../../shared/components/dropzone/Dropzone';
import TextField from '@material-ui/core/TextField';
import styled from 'styled-components';
import {ImageType} from '../../../../shared/types/apartmentComplex.types';

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
}

export function ImageDialog({setOpen, open, params}: ImageDialogProps) {
    const [image, setImage] = useState();
    const [scale, setScale] = useState(1);
    const [rotate, setRotate] = useState(0);

    const {uuid, mode} = params;

    const [uploadFile, {data: file}] = useMutation(UPLOAD_FILE);
    const editor = React.createRef<any>();
    const handleClose = () => {
        setImage(undefined);
        setOpen(false);
    };

    const handleDrop = (dropped: any) => {
        setImage(dropped);
    };

    const onSave = async () => {
        if (editor) {
            const canvasScaled = editor.current.getImageScaledToCanvas();
            const blob = await fetch(canvasScaled.toDataURL()).then((res) => res.blob());
            const file = blobToFile(blob, image.name);
            await uploadFile({
                variables: {
                    file,
                    uuid,
                    mode
                }
            });
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
                            <AvatarEditor
                                ref={editor}
                                image={image}
                                width={400}
                                height={200}
                                border={50}
                                scale={scale}
                                rotate={rotate}
                            />
                        </EditorContainer>
                        <div>
                            <Typography id="discrete-slider" gutterBottom={true}>
                                Размер
                            </Typography>
                            <Slider
                                defaultValue={1}
                                onChange={(e, value: any) => {
                                    setScale(value);
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
                                    setRotate(value);
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
                <Button disabled={!image} onClick={onSave} color="primary">
                    Сохранить
                </Button>
            </DialogActions>
        </Dialog>
    );
}
