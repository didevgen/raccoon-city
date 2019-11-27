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
import {ImageType} from '../../../../shared/types/apartmentComplex.types';
import {useMutation} from '@apollo/react-hooks';
import {UPLOAD_FILE} from '../../../../../graphql/mutations/apartmentComplexMutation';
import {APARTMENT_COMPLEX_IMAGES} from '../../../../../graphql/queries/apartmentComplexQuery';

const EditorContainer = styled.div`
    display: flex;
    justify-content: center;
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

export function VRDialog({setOpen, open, params, downloadLink}: ImageDialogProps) {
    const [image, setImage] = useState();
    const [previewUrl, setPreviewUrl] = useState(downloadLink);
    const {uuid, mode} = params;

    const [uploadFile, {data: file}] = useMutation(UPLOAD_FILE, {
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
                mode
            }
        });
    };

    return (
        <Dialog open={open} aria-labelledby="form-dialog-title" fullWidth={true} maxWidth={'md'}>
            <DialogTitle id="form-dialog-title">Добавить изображение</DialogTitle>
            <DialogContent>
                {!previewUrl && <StyledDropzone onDrop={handleDrop} />}
                {previewUrl && (
                    <Fragment>
                        <EditorContainer>
                            <Pannellum
                                width="100%"
                                height="500px"
                                image={previewUrl}
                                pitch={10}
                                yaw={180}
                                hfov={110}
                                autoLoad={true}
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
