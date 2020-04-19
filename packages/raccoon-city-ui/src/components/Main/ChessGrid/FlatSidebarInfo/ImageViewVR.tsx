import {Grid, Paper} from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';
import {PreviewImage} from '../../../shared/types/apartmentComplex.types';

const StyledPaper = styled(Paper)``;

interface ImageViewVRProps {
    images?: PreviewImage[];
}
export function ImageViewVR(props: ImageViewVRProps) {
    if (!props.images) {
        return null;
    }

    return (
        <Grid container spacing={3}>
            {props.images.map((image: PreviewImage) => {
                return (
                    <Grid item key={image.uuid} xs={12}>
                        <StyledPaper>
                            <img src={image.previewImageUrl} alt={image.name} />
                        </StyledPaper>
                    </Grid>
                );
            })}
        </Grid>
    );
}
