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

export interface ImageDialogProps {
    setOpen: (state: boolean) => void;
    open: boolean;
}

export function ImageDialog({setOpen, open}: ImageDialogProps) {
    const [image, setImage] = useState();
    const [scale, setScale] = useState(1);
    const [rotate, setRotate] = useState(0);
    const [uploadFile, {data: file}] = useMutation(UPLOAD_FILE);
    const handleClose = () => {
        setImage(undefined);
        setOpen(false);
    };

    const handleDrop = (dropped: any) => {
        setImage(dropped);
    };

    return (
        <Dialog open={open} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
            <DialogContent>
                {!image && <StyledDropzone onDrop={handleDrop} />}
                {image && (
                    <Fragment>
                        <AvatarEditor
                            image={image}
                            width={250}
                            height={250}
                            border={50}
                            scale={scale}
                            rotate={rotate}
                        />
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
                <Button
                    onClick={async () => {
                        await uploadFile({
                            variables: {
                                file: image
                            }
                        });
                    }}
                    color="primary"
                >
                    Сохранить
                </Button>
            </DialogActions>
        </Dialog>
    );
}
