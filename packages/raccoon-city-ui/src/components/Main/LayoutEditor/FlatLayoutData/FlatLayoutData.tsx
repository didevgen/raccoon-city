import {Grid, Typography} from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';
import {HouseLayout} from '../../../shared/types/layout.types';
import {ChessGridDialog} from '../ChessGridDialog/ChessGridDialog';

const Wrapper = styled.div``;
const ImageContainer = styled.img`
    max-height: 320px;
`;
const MiscContainer = styled.div``;

const FlatsContainer = styled.div`
    display: inline-flex;
    flex-wrap: wrap;
    max-width: 100%;
    .flat-number {
        margin: 8px;
    }
`;

interface FlatLayoutDataProps {
    flatLayout: HouseLayout;
    refetch: () => void;
}

export const FlatLayoutData = React.memo(({flatLayout, refetch}: FlatLayoutDataProps) => {
    return (
        <Wrapper>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <MiscContainer>
                        <Typography variant="h5" component="h5" gutterBottom>
                            {flatLayout.name}
                        </Typography>
                        <div>
                            <ChessGridDialog layoutId={flatLayout.id} refetch={refetch} />
                        </div>
                    </MiscContainer>
                </Grid>
                <Grid item xs={12}>
                    <ImageContainer src={flatLayout.image.previewImageUrl} alt="Flat layout" />
                </Grid>
                {flatLayout?.flats?.length > 0 && (
                    <Grid item xs={12}>
                        <div>
                            <Typography variant="h5" component="h5" gutterBottom>
                                Квартиры:
                            </Typography>
                            <FlatsContainer>
                                {flatLayout.flats.map((flat) => {
                                    return (
                                        <div className="flat-number" key={flat.id}>
                                            {flat.flatNumber}
                                        </div>
                                    );
                                })}
                            </FlatsContainer>
                        </div>
                    </Grid>
                )}
            </Grid>
        </Wrapper>
    );
});
