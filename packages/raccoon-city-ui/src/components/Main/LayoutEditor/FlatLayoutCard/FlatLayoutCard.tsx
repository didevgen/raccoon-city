import {CardActionArea} from '@material-ui/core';
import CardContent from '@material-ui/core/CardContent';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import {Link, useParams} from 'react-router-dom';
import {apartmentComplexDefaultImage} from '../../../../core/constants';
import {CardHeaderWithMenu} from '../../../shared/components/menus/CardHeaderWithMenu';
import {StyledCard, StyledCardMedia} from '../../../shared/components/styled';

export interface FlatLayoutCardProps {
    id: string;
    name: string;
    imageUrl?: string;
}

export function FlatLayoutCard(props: FlatLayoutCardProps) {
    const {apartmentComplexUuid, houseUuid, developerUuid} = useParams();
    return (
        <StyledCard elevation={3}>
            <CardHeaderWithMenu title={props.name}>
                <MenuItem>Редактировать</MenuItem>
                <MenuItem>Удалить</MenuItem>
            </CardHeaderWithMenu>
            <CardActionArea>
                <Link
                    to={`/developers/${developerUuid}/apartmentComplex/${apartmentComplexUuid}/house/${houseUuid}/layout/${props.id}/info`}
                >
                    <StyledCardMedia image={props.imageUrl || apartmentComplexDefaultImage} title={props.name} />
                    <CardContent>
                        <Typography variant="body2" color="textSecondary" component="p" />
                    </CardContent>
                </Link>
            </CardActionArea>
        </StyledCard>
    );
}
