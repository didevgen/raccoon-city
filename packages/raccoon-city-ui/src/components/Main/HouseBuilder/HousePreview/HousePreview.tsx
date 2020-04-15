import {useMutation} from '@apollo/react-hooks';
import {CardActionArea} from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import MenuItem from '@material-ui/core/MenuItem';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import {useParams} from 'react-router';
import {Link} from 'react-router-dom';
import {apartmentComplexDefaultImage} from '../../../../core/constants';
import {DELETE_HOUSE} from '../../../../graphql/mutations/houseMutation';
import {HOUSE_LIST} from '../../../../graphql/queries/houseQuery';
import {Confirmation} from '../../../shared/components/dialogs/ConfirmDialog';
import {CardHeaderWithMenu} from '../../../shared/components/menus/CardHeaderWithMenu';
import {StyledLink} from '../../../shared/components/styled';
import {House} from '../../../shared/types/house.types';

interface HousePreviewProps {
    house: House;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        card: {
            maxWidth: 345
        },
        media: {
            height: 0,
            paddingTop: '56.25%' // 16:9
        }
    })
);

export function HousePreview(props: HousePreviewProps) {
    const {house} = props;
    const {uuid} = useParams();
    const classes = useStyles();
    const [deleteMutation] = useMutation(DELETE_HOUSE, {
        refetchQueries: [
            {
                query: HOUSE_LIST,
                variables: {
                    apartmentComplexId: uuid
                }
            }
        ]
    });
    const image = house.images.CHESS_GRID ? house.images.CHESS_GRID.downloadUrl : apartmentComplexDefaultImage;
    return (
        <Card className={classes.card}>
            <CardHeaderWithMenu title={house.name}>
                <StyledLink to={`/apartmentComplex/${uuid}/houseEdit/${house.id}`}>
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
                <Link to={`/apartmentComplex/${uuid}/house/${house.id}/info`}>
                    <CardMedia className={classes.media} image={image} title={house.name} />
                    <CardContent>
                        <Typography variant="body2" color="textSecondary" component="p" />
                    </CardContent>
                </Link>
            </CardActionArea>
        </Card>
    );
}
