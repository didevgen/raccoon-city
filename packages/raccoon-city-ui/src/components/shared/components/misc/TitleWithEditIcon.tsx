import Typography from '@material-ui/core/Typography';
import EditIcon from '@material-ui/icons/Edit';
import * as React from 'react';
import styled from 'styled-components';
import {StyledLink} from '../styled';

const TitleContainer = styled.div`
    display: inline-flex;
    align-items: center;

    ${StyledLink} {
        display: inline-flex;
        margin-left: 4px;
    }
`;

interface TitleWithEditIconProps {
    editUrl: string;
    title: string;
}

export function TitleWithEditIcon({editUrl, title}: TitleWithEditIconProps) {
    return (
        <Typography variant="h5" gutterBottom={true}>
            <TitleContainer>
                <div>{title}</div>
                <StyledLink to={editUrl}>
                    <EditIcon color="primary" />
                </StyledLink>
            </TitleContainer>
        </Typography>
    );
}
