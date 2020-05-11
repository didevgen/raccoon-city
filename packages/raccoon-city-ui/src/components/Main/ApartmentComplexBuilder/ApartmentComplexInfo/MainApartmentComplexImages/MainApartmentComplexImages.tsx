import {useMutation} from '@apollo/react-hooks';
import * as React from 'react';
import {Fragment} from 'react';
import {useParams} from 'react-router';
import styled from 'styled-components';
import {apartmentComplexDefaultImage} from '../../../../../core/constants';
import {UPLOAD_FILE} from '../../../../../graphql/mutations/apartmentComplexMutation';
import {APARTMENT_COMPLEX_INFO} from '../../../../../graphql/queries/apartmentComplexQuery';
import {ApartmentComplexImages, ImageType, SingleImage} from '../../../../shared/types/apartmentComplex.types';
import {ImageDialog} from '../../../Images/ImageDialog/ImageDialog';

const HouseImage = styled.img`
    width: 90%;
    margin: 8px;
    align-self: center;
    border: 1px solid #ccc;
    cursor: pointer;
`;

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
        <Fragment>
            <HouseImage
                src={image.downloadUrl}
                alt={'ЖК'}
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
    images: ApartmentComplexImages;
}

export function MainApartmentComplexImages({images}: MainApartmentComplexImagesProps) {
    const {apartmentComplexUuid} = useParams();
    return (
        <PreviewComponent
            images={images}
            uuid={apartmentComplexUuid as string}
            mode={{
                title: 'Изображение',
                value: ImageType.CHESS_GRID
            }}
        />
    );
}
