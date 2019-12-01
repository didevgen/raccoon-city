import {Fab} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import AddIcon from '@material-ui/icons/Add';
import * as React from 'react';
import {Fragment} from 'react';
import styled from 'styled-components';
import {ImageType, NamedImage} from '../../../../shared/types/apartmentComplex.types';
import {ImagePreview} from '../ImagePreview/ImagePreview';
import {PhotoDialog} from '../PhotoDialog/PhotoDialog';

interface PreviewComponentProps {
    uuid: string;
    images: NamedImage[];
    mode: ImageType;
}

interface NewVRImageProps {
    uuid: string;
    mode: ImageType;
}

const ButtonContainer = styled.div`
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

function NewPhoto({uuid, mode}: NewVRImageProps) {
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
            <PhotoDialog setOpen={setOpen} open={open} params={{uuid, mode}} />
        </ButtonContainer>
    );
}

export function Photos(props: PreviewComponentProps) {
    return (
        <Fragment>
            <Grid container={true} spacing={3} alignItems="center">
                <Grid item={true} xs={12} md={3}>
                    <NewPhoto uuid={props.uuid} mode={props.mode} />
                </Grid>
                {props.images.map((image) => {
                    return (
                        <Grid item={true} xs={12} md={3} key={image.uuid}>
                            <ImagePreview
                                uuid={props.uuid}
                                imageUuid={image.uuid}
                                mode={props.mode}
                                url={image.downloadUrl}
                                title={image.name}
                            >
                                {(toggle: (a: boolean) => void, state: boolean, params: any) => {
                                    return (
                                        <PhotoDialog
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
