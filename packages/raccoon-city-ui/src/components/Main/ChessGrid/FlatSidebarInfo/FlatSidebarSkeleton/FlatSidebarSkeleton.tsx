import Skeleton from '@material-ui/lab/Skeleton';
import React from 'react';
import styled from 'styled-components';

const SkeletonWrapper = styled.div`
    display: flex;
    flex-direction: column;
    padding: 16px;
`;
export function FlatSidebarSkeleton() {
    return (
        <SkeletonWrapper>
            <Skeleton variant="rect" width={320} height={210} style={{marginBottom: 16}} />
            <Skeleton style={{marginBottom: 6}} />
            <Skeleton style={{marginBottom: 6}} width="80%" />
            <Skeleton style={{marginBottom: 6}} />
            <Skeleton style={{marginBottom: 6}} width="60%" />
            <Skeleton style={{marginBottom: 6}} width="75%" />
            <Skeleton style={{marginBottom: 6}} width="80%" />
        </SkeletonWrapper>
    );
}
