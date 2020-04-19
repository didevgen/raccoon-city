import {Grid, Paper} from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';
import {NamedImage} from '../../../shared/types/apartmentComplex.types';

const StyledPaper = styled(Paper)`
    img {
        width: 320px;
    }
`;

interface ImageViewPhotosProps {
    images?: NamedImage[];
}
export function ImageViewPhotos(props: ImageViewPhotosProps) {
    if (!props.images) {
        return null;
    }

    return (
        <Grid container spacing={3}>
            {props.images.map((image: NamedImage) => {
                return (
                    <Grid item key={image.uuid} xs={12}>
                        <StyledPaper>
                            <img src={image.downloadUrl} alt={image.name} />
                        </StyledPaper>
                    </Grid>
                );
            })}
        </Grid>
    );
}
