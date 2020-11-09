import styled from 'styled-components';
import {Button} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

export const StyledButton = styled(Button)`

    &.MuiButton-contained{
        margin-bottom: 16px !important;
        color: #fff
        background: #37485c;
    }

    &.MuiButton-contained:hover{
        background: #E84F1D;
    }
`;

export const StyledIconButton = styled(IconButton)`
    margin-left: auto !important;
    margin-right: 0 !important;
`;

export const StyledInfo = styled(Typography)`
    align-self: center;
`;
