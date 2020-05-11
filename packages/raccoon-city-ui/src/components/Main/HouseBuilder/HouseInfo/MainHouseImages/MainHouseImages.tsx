import * as React from 'react';
import {Fragment} from 'react';
import {useParams} from 'react-router';
import {apartmentComplexDefaultImage} from '../../../../../core/constants';
import {ApartmentComplexImages, ImageType, SingleImage} from '../../../../shared/types/apartmentComplex.types';
import {ImageDialog} from '../../../Images/ImageDialog/ImageDialog';
import {useMutation} from '@apollo/react-hooks';
import {UPLOAD_FILE} from '../../../../../graphql/mutations/houseMutation';
import {HOUSE_INFO} from '../../../../../graphql/queries/houseQuery';
import {HouseImages} from '../../../../shared/types/house.types';
import styled from 'styled-components';

interface Mode {
    title: string;
    value: ImageType;
}

interface PreviewComponentProps {
    uuid: string;
    mode: Mode;
    images: ApartmentComplexImages;
}

const HouseImage = styled.img`
    width: 90%;
    margin: 8px;
    align-self: center;
    border: 1px solid #ccc;
    cursor: pointer;
`;

function PreviewComponent(props: PreviewComponentProps) {
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
        <Fragment>
            <HouseImage
                src={image.downloadUrl}
                alt={'Дом'}
                onClick={() => {
                    setOpen(true);
                }}
            />
            <ImageDialog
                mutation={mutation}
                setOpen={setOpen}
                open={open}
                params={{uuid: props.uuid, mode: props.mode.value}}
            />
        </Fragment>
    );
}

interface MainApartmentComplexImagesProps {
    images: HouseImages;
}

export function MainHouseImages({images}: MainApartmentComplexImagesProps) {
    const {houseUuid: uuid} = useParams();
    return (
        <PreviewComponent
            images={images}
            uuid={uuid as string}
            mode={{
                title: 'Изображение',
                value: ImageType.CHESS_GRID
            }}
        />
    );
}
