import {useMutation} from '@apollo/react-hooks';
import {CardActionArea} from '@material-ui/core';
import CardContent from '@material-ui/core/CardContent';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import {useParams} from 'react-router';
import {Link} from 'react-router-dom';
import {apartmentComplexDefaultImage} from '../../../../core/constants';
import {DELETE_HOUSE} from '../../../../graphql/mutations/houseMutation';
import {HOUSE_LIST} from '../../../../graphql/queries/houseQuery';
import {Confirmation} from '../../../shared/components/dialogs/ConfirmDialog';
import {CardHeaderWithMenu} from '../../../shared/components/menus/CardHeaderWithMenu';
import {StyledCard, StyledCardMedia, StyledLink} from '../../../shared/components/styled';
import {House} from '../../../shared/types/house.types';

interface HousePreviewProps {
    house: House;
}

export function HousePreview(props: HousePreviewProps) {
    const {house} = props;
    const {apartmentComplexUuid, developerUuid} = useParams();
    const [deleteMutation] = useMutation(DELETE_HOUSE, {
        refetchQueries: [
            {
                query: HOUSE_LIST,
                variables: {
                    apartmentComplexId: apartmentComplexUuid
                }
            }
        ]
    });
    const image = house.images.CHESS_GRID ? house.images.CHESS_GRID.downloadUrl : apartmentComplexDefaultImage;
    return (
        <StyledCard>
            <CardHeaderWithMenu title={house.name}>
                <StyledLink
                    to={`/developers/${developerUuid}/apartmentComplex/${apartmentComplexUuid}/houseEdit/${house.id}`}
                >
                    <MenuItem>Редактировать</MenuItem>
                </StyledLink>
                <Confirmation>
                    {(confirmFn: (cb: () => void) => void) => {
                        return (
                            <MenuItem
                                onClick={() => {
                                    confirmFn(() => async () => {
                                        await deleteMutation({
                                            variables: {
                                                uuid: house.id
                                            }
                                        });
                                    });
                                }}
                            >
                                Удалить
                            </MenuItem>
                        );
                    }}
                </Confirmation>
            </CardHeaderWithMenu>
            <CardActionArea>
                <Link
                    to={`/developers/${developerUuid}/apartmentComplex/${apartmentComplexUuid}/house/${house.id}/info`}
                >
                    <StyledCardMedia image={image} title={house.name} />
                    <CardContent>
                        <Typography variant="body2" color="textSecondary" component="p" />
                    </CardContent>
                </Link>
            </CardActionArea>
        </StyledCard>
    );
}
