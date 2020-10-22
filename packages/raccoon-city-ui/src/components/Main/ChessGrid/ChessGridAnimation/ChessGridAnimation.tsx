import Skeleton from '@material-ui/lab/Skeleton';
import React from 'react';
import styled from 'styled-components';
const AnimationContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin: 0 16px;
`;

const AnimationRow = styled.div`
    display: flex;
    flex-direction: row;
`;

const StyledSkeleton = styled(Skeleton)`
    margin: 8px;
`;

const Wrapper = styled.div`
    display: flex;
    flex-direction: row;
`;

const ChessGridAnimationColumn = ({rowAmount, cellAmount}) => (
    <AnimationContainer>
        {Array.from(Array(rowAmount)).map((item, i) => {
            return (
                <AnimationRow key={`chessGridLoadingRow-${i}`}>
                    {Array.from(Array(cellAmount)).map((cell, cellIndex) => {
                        return (
                            <StyledSkeleton
                                variant="rect"
                                width={56}
                                height={56}
                                key={`chessGridLoadingCell-${i}-${cellIndex}`}
                            />
                        );
                    })}
                </AnimationRow>
            );
        })}
    </AnimationContainer>
);
export function ChessGridAnimation() {
    return (
        <Wrapper>
            <ChessGridAnimationColumn rowAmount={8} cellAmount={4} />
            <ChessGridAnimationColumn rowAmount={3} cellAmount={3} />
            <ChessGridAnimationColumn rowAmount={6} cellAmount={4} />
        </Wrapper>
    );
}
