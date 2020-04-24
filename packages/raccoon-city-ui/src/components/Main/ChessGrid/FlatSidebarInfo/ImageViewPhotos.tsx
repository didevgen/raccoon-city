import {Grid, Paper} from '@material-ui/core';
import React, {useEffect, useState} from 'react';
import {PhotoSwipe} from 'react-photoswipe';
import styled from 'styled-components';
import {NamedImage} from '../../../shared/types/apartmentComplex.types';

const StyledPaper = styled(Paper)`
    img {
        width: 320px;
    }
`;

interface ImageViewPhotosProps {
    images?: NamedImage[];
}
export function ImageViewPhotos(props: ImageViewPhotosProps) {
    const [items, setItems] = useState<any[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState(0);
    useEffect(() => {
        if (!props.images) {
            return;
        }

        setItems(
            props.images.map((image) => {
                return {
                    src: image.downloadUrl,
                    thumbnail: image.downloadUrl,
                    w: 0,
                    h: 0,
                    title: image.name
                };
            })
        );
        // eslint-disable-next-line
    }, []);

    if (!props.images) {
        return null;
    }

    return (
        <Grid container spacing={3}>
            {props.images.map((image: NamedImage, i) => {
                return (
                    <Grid item key={image.uuid} xs={12}>
                        <StyledPaper
                            onClick={() => {
                                setSelected(i);
                                setIsOpen(true);
                            }}
                        >
                            <img src={image.downloadUrl} alt={image.name} />
                        </StyledPaper>
                    </Grid>
                );
            })}
            <PhotoSwipe
                isOpen={isOpen}
                items={items}
                options={{
                    index: selected
                }}
                gettingData={(gallery, index, item) => {
                    if (item.w < 1 || item.h < 1) {
                        const img = new Image();
                        img.onload = () => {
                            item.w = img.naturalWidth;
                            item.h = img.naturalHeight;

                            gallery.invalidateCurrItems();
                            gallery.updateSize(true);
                        };
                        img.src = item.src;
                    }
                }}
                onClose={() => {
                    setIsOpen(false);
                }}
            />
        </Grid>
    );
}
