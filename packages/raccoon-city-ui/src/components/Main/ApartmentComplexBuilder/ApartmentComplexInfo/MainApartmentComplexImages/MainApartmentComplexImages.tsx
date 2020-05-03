import {CardActionArea} from '@material-ui/core';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
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
import {UPLOAD_FILE} from '../../../../../graphql/mutations/apartmentComplexMutation';
import {APARTMENT_COMPLEX_INFO} from '../../../../../graphql/queries/apartmentComplexQuery';
import {StyledCard, StyledCardMedia} from '../../../../shared/components/styled';

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
    const [open, setOpen] = React.useState(false);
    const image: SingleImage = (props.images[props.mode.value] || {
        uuid: '',
        downloadUrl: apartmentComplexDefaultImage
    }) as SingleImage;

    const mutation = useMutation(UPLOAD_FILE, {
        refetchQueries: [
            {
                query: APARTMENT_COMPLEX_INFO,
                variables: {
                    uuid: props.uuid
                }
            }
        ]
    });

    return (
        <StyledCard>
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
                <StyledCardMedia image={image.downloadUrl} />
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
        </StyledCard>
    );
}

interface MainApartmentComplexImagesProps {
    images: ApartmentComplexImages;
}

export function MainApartmentComplexImages({images}: MainApartmentComplexImagesProps) {
    const {apartmentComplexUuid} = useParams();
    return (
        <Grid container={true} spacing={3}>
            <Grid item xs={4}>
                <PreviewComponent
                    images={images}
                    uuid={apartmentComplexUuid as string}
                    mode={{
                        title: 'Сайт',
                        value: ImageType.SITE
                    }}
                />
            </Grid>
            <Grid item xs={4}>
                <PreviewComponent
                    images={images}
                    uuid={apartmentComplexUuid as string}
                    mode={{
                        title: 'Приложение',
                        value: ImageType.MOBILE
                    }}
                />
            </Grid>
            <Grid item xs={4}>
                <PreviewComponent
                    images={images}
                    uuid={apartmentComplexUuid as string}
                    mode={{
                        title: 'Шахматка',
                        value: ImageType.CHESS_GRID
                    }}
                />
            </Grid>
        </Grid>
    );
}
