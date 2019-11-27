import {Fab} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import AddIcon from '@material-ui/icons/Add';
import * as React from 'react';
import {Fragment} from 'react';
import styled from 'styled-components';
import {ImageType, PreviewImage} from '../../../../shared/types/apartmentComplex.types';
import {ImagePreview} from '../ImagePreview/ImagePreview';
import {VRDialog} from '../VRDialog/VRDialog';

interface PreviewComponentProps {
    uuid: string;
    images: PreviewImage[];
}

interface NewVRImageProps {
    uuid: string;
}

const ButtonContainer = styled.div`
    width: 345px;
    height: 140px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const StyledFab = styled(Fab)`
    &.MuiFab-root {
        width: 140px;
        height: 140px;
        .MuiSvgIcon-root {
            width: 3em;
            height: 3em;
        }
    }
`;

function NewVRImage({uuid}: NewVRImageProps) {
    const [open, setOpen] = React.useState(false);

    return (
        <ButtonContainer>
            <StyledFab
                color="secondary"
                aria-label="add"
                onClick={() => {
                    setOpen(true);
                }}
            >
                <AddIcon />
            </StyledFab>
            <VRDialog setOpen={setOpen} open={open} params={{uuid, mode: ImageType.VR}} />
        </ButtonContainer>
    );
}

export function VRImages(props: PreviewComponentProps) {
    return (
        <Fragment>
            <Grid container={true} spacing={3} alignItems="center">
                <Grid item={true} xs={12} md={3}>
                    <NewVRImage uuid={props.uuid} />
                </Grid>
                {props.images.map((image) => {
                    return (
                        <Grid item={true} xs={12} md={3} key={image.uuid}>
                            <ImagePreview uuid={props.uuid} mode={ImageType.VR} url={image.previewImageUrl}>
                                {(toggle: (a: boolean) => void, state: boolean, params: any) => {
                                    return (
                                        <VRDialog
                                            setOpen={toggle}
                                            open={state}
                                            params={params}
                                            downloadLink={image.downloadUrl}
                                        />
                                    );
                                }}
                            </ImagePreview>
                        </Grid>
                    );
                })}
            </Grid>
        </Fragment>
    );
}
