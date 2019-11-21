import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import React, {useState, Fragment} from 'react';
import AvatarEditor from 'react-avatar-editor';
import {StyledDropzone} from '../../../../shared/components/dropzone/Dropzone';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';

export interface ImageDialogProps {
    setOpen: (state: boolean) => void;
    open: boolean;
}

export function ImageDialog({setOpen, open}: ImageDialogProps) {
    const [image, setImage] = useState();
    const [scale, setScale] = useState(1);
    const [rotate, setRotate] = useState(0);

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
                            <Typography id="discrete-slider" gutterBottom>
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
                                marks
                                min={0.1}
                                max={3}
                            />
                        </div>
                        <div>
                            <Typography id="discrete-slider" gutterBottom>
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
                                marks
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
                <Button onClick={handleClose} color="primary">
                    Сохранить
                </Button>
            </DialogActions>
        </Dialog>
    );
}
