import {useMutation} from '@apollo/react-hooks';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
// @ts-ignore
import React, {Fragment, useState} from 'react';
import styled from 'styled-components';
import {UPLOAD_FILE} from '../../../../../graphql/mutations/apartmentComplexMutation';
import {APARTMENT_COMPLEX_IMAGES} from '../../../../../graphql/queries/apartmentComplexQuery';
import {StyledDropzone} from '../../../../shared/components/dropzone/Dropzone';
import {ImageType} from '../../../../shared/types/apartmentComplex.types';

const EditorContainer = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: column;
`;

export interface ImageDialogProps {
    setOpen: (state: boolean) => void;
    open: boolean;
    downloadLink?: string;
    params: {
        uuid: string;
        mode: ImageType;
    };
}

const ImageContainer = styled.div`
    max-width: 720px;
    align-self: center;
`;
const StyledImage = styled.img`
    max-width: 100%;
`;

export function PhotoDialog({setOpen, open, params, downloadLink}: ImageDialogProps) {
    const [image, setImage] = useState();
    const [name, setName] = useState();
    const [previewUrl, setPreviewUrl] = useState(downloadLink);
    const {uuid, mode} = params;

    const [uploadFile, {loading}] = useMutation(UPLOAD_FILE, {
        refetchQueries: [
            {
                query: APARTMENT_COMPLEX_IMAGES,
                variables: {
                    uuid
                }
            }
        ]
    });

    const handleClose = () => {
        setImage(undefined);
        setPreviewUrl(undefined);
        setOpen(false);
    };

    const handleDrop = (dropped: any) => {
        setImage(dropped);
        const reader = new FileReader();
        reader.readAsDataURL(dropped);

        reader.onloadend = (e) => {
            setPreviewUrl(reader.result as string);
        };
    };

    const onSave = async () => {
        await uploadFile({
            variables: {
                file: image,
                uuid,
                mode,
                name
            }
        });
        handleClose();
    };
    return (
        <Dialog open={open} aria-labelledby="form-dialog-title" fullWidth={true} maxWidth={'md'}>
            <DialogTitle id="form-dialog-title">Добавить изображение</DialogTitle>
            <DialogContent>
                {!previewUrl && <StyledDropzone onDrop={handleDrop} />}
                {previewUrl && (
                    <Fragment>
                        <EditorContainer>
                            <ImageContainer>
                                <StyledImage src={previewUrl} />
                            </ImageContainer>
                            <div>
                                <TextField
                                    label="Название"
                                    margin="normal"
                                    value={name}
                                    onChange={(e) => {
                                        setName(e.target.value);
                                    }}
                                    fullWidth={true}
                                    variant="outlined"
                                />
                            </div>
                        </EditorContainer>
                    </Fragment>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Отмена
                </Button>
                <Button disabled={!image || loading || !name} onClick={onSave} color="primary">
                    {loading && <CircularProgress size={30} thickness={5} />}
                    Сохранить
                </Button>
            </DialogActions>
        </Dialog>
    );
}
