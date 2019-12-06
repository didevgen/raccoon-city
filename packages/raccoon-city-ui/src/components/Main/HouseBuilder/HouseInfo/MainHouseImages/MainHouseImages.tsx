import {CardActionArea, createStyles, makeStyles, Theme} from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/core/SvgIcon/SvgIcon';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import {useParams} from 'react-router';
import {apartmentComplexDefaultImage} from '../../../../../core/constants';
import {ApartmentComplexImages, ImageType, SingleImage} from '../../../../shared/types/apartmentComplex.types';
import {ImageDialog} from '../../../Images/ImageDialog/ImageDialog';
import {useMutation} from '@apollo/react-hooks';
import {UPLOAD_FILE} from '../../../../../graphql/mutations/houseMutation';
import {HOUSE_INFO} from '../../../../../graphql/queries/houseQuery';
import {HouseImages} from '../../../../shared/types/house.types';

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

interface Mode {
    title: string;
    value: ImageType;
}

interface PreviewComponentProps {
    uuid: string;
    mode: Mode;
    images: ApartmentComplexImages;
}

function PreviewComponent(props: PreviewComponentProps) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const image: SingleImage = (props.images[props.mode.value] || {
        uuid: '',
        downloadUrl: apartmentComplexDefaultImage
    }) as SingleImage;

    const mutation = useMutation(UPLOAD_FILE, {
        refetchQueries: [
            {
                query: HOUSE_INFO,
                variables: {
                    uuid: props.uuid
                }
            }
        ]
    });

    return (
        <Card className={classes.card}>
            <CardHeader
                action={
                    <IconButton aria-label="settings">
                        <MoreVertIcon />
                    </IconButton>
                }
                title={props.mode.title}
            />
            <CardActionArea
                onClick={() => {
                    setOpen(true);
                }}
            >
                <CardMedia className={classes.media} image={image.downloadUrl} />
                <CardContent>
                    <Typography variant="body2" color="textSecondary" component="p" />
                </CardContent>
            </CardActionArea>
            <ImageDialog
                mutation={mutation}
                setOpen={setOpen}
                open={open}
                params={{uuid: props.uuid, mode: props.mode.value}}
            />
        </Card>
    );
}

interface MainApartmentComplexImagesProps {
    images: HouseImages;
}

export function MainHouseImages({images}: MainApartmentComplexImagesProps) {
    const {houseUuid: uuid} = useParams();
    return (
        <Grid container={true} spacing={3}>
            <Grid item={true} xs={4}>
                <PreviewComponent
                    images={images}
                    uuid={uuid as string}
                    mode={{
                        title: 'Сайт',
                        value: ImageType.SITE
                    }}
                />
            </Grid>
            <Grid item={true} xs={4}>
                <PreviewComponent
                    images={images}
                    uuid={uuid as string}
                    mode={{
                        title: 'Приложение',
                        value: ImageType.MOBILE
                    }}
                />
            </Grid>
            <Grid item={true} xs={4}>
                <PreviewComponent
                    images={images}
                    uuid={uuid as string}
                    mode={{
                        title: 'Шахматка',
                        value: ImageType.CHESS_GRID
                    }}
                />
            </Grid>
        </Grid>
    );
}
