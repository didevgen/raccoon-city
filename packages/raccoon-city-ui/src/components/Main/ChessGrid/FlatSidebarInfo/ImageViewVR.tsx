import {Grid, Paper} from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';
import {ImageType, PreviewImage} from '../../../shared/types/apartmentComplex.types';
import {SidebarVRDialog} from './SidebarVRDialog';

const StyledPaper = styled(Paper)``;

interface ImageViewVRProps {
    images?: PreviewImage[];
    mode: ImageType;
}
export function ImageViewVR(props: ImageViewVRProps) {
    const [open, setOpen] = React.useState(false);
    const [name, setName] = React.useState('');
    const [downloadLink, setDownloadLink] = React.useState('');

    if (!props.images) {
        return null;
    }

    return (
        <Grid container spacing={3}>
            {props.images.map((image: PreviewImage) => {
                return (
                    <Grid item key={image.uuid} xs={12}>
                        <StyledPaper
                            onClick={() => {
                                setDownloadLink(image.downloadUrl);
                                setName(image.name);
                                setOpen(true);
                            }}
                        >
                            <img src={image.previewImageUrl} alt={image.name} />
                        </StyledPaper>
                    </Grid>
                );
            })}
            <SidebarVRDialog setOpen={setOpen} open={open} mode={props.mode} downloadLink={downloadLink} name={name} />
        </Grid>
    );
}
