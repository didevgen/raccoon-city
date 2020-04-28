import {useMutation, useQuery} from '@apollo/react-hooks';
import {CardActionArea} from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import {Link} from 'react-router-dom';
import styled from 'styled-components';
import {apartmentComplexDefaultImage} from '../../../core/constants';
import {DELETE_DEVELOPER} from '../../../graphql/mutations/developerMutaion';
import {GET_DEVELOPERS} from '../../../graphql/queries/developerQuery';
import {AddButton} from '../../shared/components/buttons/AddButton';
import {Confirmation} from '../../shared/components/dialogs/ConfirmDialog';
import {CardHeaderWithMenu} from '../../shared/components/menus/CardHeaderWithMenu';
import {StyledLink} from '../../shared/components/styled';

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

export interface DeveloperCardProps {
    id: string;
    name: string;
    imageUrl?: string;
}

function DeveloperCard(props: DeveloperCardProps) {
    const classes = useStyles();
    const [deleteMutation] = useMutation(DELETE_DEVELOPER);
    return (
        <Card className={classes.card} elevation={3}>
            <CardHeaderWithMenu title={props.name}>
                <StyledLink to={`/developer/${props.id}/edit`}>
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
                                                id: props.id
                                            },
                                            refetchQueries: [
                                                {
                                                    query: GET_DEVELOPERS
                                                }
                                            ]
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
                <Link to={`/developers/${props.id}/apartmentComplexes`}>
                    <CardMedia
                        className={classes.media}
                        image={props.imageUrl || apartmentComplexDefaultImage}
                        title={props.name}
                    />
                    <CardContent>
                        <Typography variant="body2" color="textSecondary" component="p" />
                    </CardContent>
                </Link>
            </CardActionArea>
        </Card>
    );
}

const EmptyDevelopersContainer = styled.div`
    width: 100%;
    height: 80vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    text-align: center;
    h4 {
        margin-bottom: 32px;
    }
`;

function EmptyDevelopers() {
    return (
        <EmptyDevelopersContainer>
            <Typography component="h4" variant="h4" gutterBottom={true}>
                Вы еще не создали застройщика. Желаете создать?
            </Typography>
            <AddButton url={'/developer/new'} />
        </EmptyDevelopersContainer>
    );
}

export function DeveloperList() {
    const {loading, error, data} = useQuery(GET_DEVELOPERS, {
        fetchPolicy: 'cache-and-network'
    });
    if (loading) {
        return <span>Loading</span>;
    }

    if (error || !data) {
        return <span>Error</span>;
    }

    if (data.getDevelopers.length === 0) {
        return <EmptyDevelopers />;
    }

    return (
        <Grid container={true} spacing={3} alignItems="center">
            <Grid item={true} xs={12} md={3}>
                <AddButton url={'/developer/new'} />
            </Grid>
            {data.getDevelopers.map((developer) => {
                return (
                    <Grid item={true} xs={12} md={3} key={developer.id}>
                        <DeveloperCard
                            id={developer.id}
                            name={developer.name}
                            imageUrl={developer?.logo?.downloadUrl}
                        />
                    </Grid>
                );
            })}
        </Grid>
    );
}
