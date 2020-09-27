import {Grid, Paper} from '@material-ui/core';
import {Path, Svg, SVG, Rect} from '@svgdotjs/svg.js';
import React, {useEffect, useRef} from 'react';
import styled from 'styled-components';
import {SinglePreviewImage} from '../../../shared/types/layout.types';

const ImageContainer = styled.div<any>`
    max-width: 320px;
    background: url(${(props: any) => props.url});
    background-size: cover;
`;

const StyledPaper = styled(Paper)`
    max-width: 320px;
`;

const ImageContainerLarge = styled.div<any>`
    max-width: 100%;
    height: auto;
    background: url(${(props: any) => props.url});
    background-size: cover;

    /* &::before {
        position: fixed;
        content: 'Im here';
        top: 568px;
        left: 645px;
        transform: translate(-100%, -100%);
        color: red;
        margin: 0;
        padding: 0;
    } */
`;

const StyledPaperLarge = styled(Paper)`
    max-width: 100%;
`;

interface LayoutViewProps {
    levelLayouts: Array<{
        id: string;
        paths: string[];
        image: SinglePreviewImage;
        viewBox: {width: number; height: number};
    }>;
    isLarge?: boolean;
    setCurrentDataId?: any;
    mainImage?: string;
}

function attachSvg(container: string) {
    return SVG()
        .addTo(container)
        .size('100%', '100%');
}

function fillExistingLayouts(svgItem: Svg, paths: string[], viewBox, info?: any, setCurrentDataId?: any) {
    if (info) {
        info.forEach((item, i) => {
            let pathParsed = JSON.parse(paths[i]);

            const colors = {
                FREE: '#4caf50',
                SOLD_OUT: '#f44336',
                UNAVAILABLE: '#9e9e9e',
                RESERVED: '#ffeb3b',
                DOCUMENTS_IN_PROGRESS: '#00bcd4',
                BOOKED: '#ffeb3b'
            };

            const path = svgItem
                .viewbox(0, 0, viewBox.width, viewBox.height)
                .path(pathParsed)
                .fill({
                    color: colors[item.status],
                    opacity: 0.5
                })
                .stroke({color: '#3f51b5', width: 3})
                .addClass('SVG--highlighted');

            path.attr({x: 20, y: 60, ['data-uid']: item.id});

            path.on('mouseover', (e) => {
                setCurrentDataId(e.target.getAttribute('data-uid'));
            });
        });

        return;
    }

    paths.forEach((pathValue, i) => {
        let pathParsed = JSON.parse(pathValue);

        const path = svgItem
            .viewbox(0, 0, viewBox.width, viewBox.height)
            .path(pathParsed)
            .fill({
                color: info.status ? 'red' : '#000',
                opacity: 0.5
            })
            .stroke({color: '#3f51b5', width: 3})
            .addClass('SVG--highlighted');
    });
}

function ImageWithSvg({image, paths, index, viewBox, isLarge, info = null, setCurrentDataId = null}) {
    const svgRef = useRef<Svg>();

    useEffect(() => {
        svgRef.current = attachSvg(`#img-container__${index}`);

        if (svgRef && svgRef.current) {
            fillExistingLayouts(svgRef.current, paths, viewBox, info, setCurrentDataId);
        }
        // eslint-disable-next-line
    }, []);

    if (isLarge) {
        return <ImageContainerLarge id={`img-container__${index}`} url={image.previewImageUrl} alt={'layout image'} />;
    }

    return <ImageContainer id={`img-container__${index}`} url={image.previewImageUrl} alt={'layout image'} />;
}

export function LayoutView(props: LayoutViewProps) {
    const {levelLayouts, isLarge = false, setCurrentDataId = null, mainImage} = props;

    if (!levelLayouts) {
        return null;
    }

    const updatedFloor: any = {};

    if (isLarge) {
        updatedFloor.image = mainImage;
        updatedFloor.viewBox = levelLayouts[0].viewBox;

        const newPaths: any = levelLayouts.reduce((acc: any, item: any) => [...acc, ...item.paths], []);

        const newInfo: any = levelLayouts.reduce(
            (acc: any, item: any) => [...acc, {id: item.id, status: item.status}],
            []
        );

        updatedFloor.paths = [...newPaths];
        updatedFloor.info = [...newInfo];
    }

    return (
        <Grid container spacing={3}>
            {isLarge ? (
                <Grid item xs={12}>
                    <StyledPaperLarge>
                        <ImageWithSvg
                            image={mainImage}
                            paths={updatedFloor.paths}
                            index={0}
                            viewBox={updatedFloor.viewBox}
                            isLarge={true}
                            info={updatedFloor.info}
                            setCurrentDataId={setCurrentDataId}
                        />
                    </StyledPaperLarge>
                </Grid>
            ) : (
                levelLayouts.map((layout, i) => {
                    return (
                        <Grid item key={layout.id} xs={12}>
                            <StyledPaper>
                                <ImageWithSvg
                                    image={layout.image}
                                    paths={layout.paths}
                                    index={i}
                                    viewBox={layout.viewBox}
                                    isLarge={false}
                                />
                            </StyledPaper>
                        </Grid>
                    );
                })
            )}
        </Grid>
    );
}
