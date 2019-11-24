import Button from '@material-ui/core/Button';
import {ImageDialog} from '../ImageDialog/ImageDialog';
import * as React from 'react';
import {useParams} from 'react-router';
import Grid from '@material-ui/core/Grid';
import CardHeader from '@material-ui/core/CardHeader';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/core/SvgIcon/SvgIcon';
import {CardActionArea, createStyles, makeStyles, Theme} from '@material-ui/core';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import {ImageType} from '../../../../shared/types/apartmentComplex.types';

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
}

function PreviewComponent(props: PreviewComponentProps) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);

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
                <CardMedia
                    className={classes.media}
                    image="https://www.zhilstroj-2.ua/wp-content/uploads/2019/09/17967-500x354.jpg"
                    title="МФК «МАНХЭТТЕН»"
                />
                <CardContent>
                    <Typography variant="body2" color="textSecondary" component="p"></Typography>
                </CardContent>
            </CardActionArea>
            <ImageDialog setOpen={setOpen} open={open} params={{uuid: props.uuid, mode: props.mode.value}} />
        </Card>
    );
}

export function MainApartmentComplexImages() {
    const {uuid} = useParams();
    return (
        <Grid container spacing={3}>
            <Grid item xs={4}>
                <PreviewComponent
                    uuid={uuid as string}
                    mode={{
                        title: 'Сайт',
                        value: ImageType.SITE
                    }}
                />
            </Grid>
            <Grid item xs={4}>
                <PreviewComponent
                    uuid={uuid as string}
                    mode={{
                        title: 'Приложение',
                        value: ImageType.MOBILE
                    }}
                />
            </Grid>
            <Grid item xs={4}>
                <PreviewComponent
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
