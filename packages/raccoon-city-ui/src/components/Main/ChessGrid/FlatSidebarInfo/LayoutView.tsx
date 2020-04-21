import {Grid, Paper} from '@material-ui/core';
import {Path, Svg, SVG} from '@svgdotjs/svg.js';
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

interface LayoutViewProps {
    levelLayouts: Array<{
        id: string;
        paths: string[];
        image: SinglePreviewImage;
        viewBox: {width: number; height: number};
    }>;
}

function attachSvg(container: string) {
    return SVG()
        .addTo(container)
        .size('100%', '100%');
}

function fillExistingLayouts(svgItem: Svg, paths: string[], viewBox) {
    const pathArray: Path[] = [];
    paths.forEach((pathValue) => {
        const pathParsed = JSON.parse(pathValue);
        const path = svgItem
            .viewbox(0, 0, viewBox.width, viewBox.height)
            .path(pathParsed)
            .fill({color: '#000', opacity: 0.5})
            .stroke({color: '#3f51b5', width: 3})
            .addClass('SVG--highlighted');
        pathArray.push(path);
    });
}

function ImageWithSvg({image, paths, index, viewBox}) {
    const svgRef = useRef<Svg>();

    useEffect(() => {
        svgRef.current = attachSvg(`#img-container__${index}`);
        if (svgRef && svgRef.current) {
            fillExistingLayouts(svgRef.current, paths, viewBox);
        }
        // eslint-disable-next-line
    }, []);
    return <ImageContainer id={`img-container__${index}`} url={image.previewImageUrl} alt={'layout image'} />;
}

export function LayoutView(props: LayoutViewProps) {
    const {levelLayouts} = props;
    if (!levelLayouts) {
        return null;
    }
    return (
        <Grid container spacing={3}>
            {levelLayouts.map((layout, i) => {
                return (
                    <Grid item key={layout.id} xs={12}>
                        <StyledPaper>
                            <ImageWithSvg
                                image={layout.image}
                                paths={layout.paths}
                                index={i}
                                viewBox={layout.viewBox}
                            />
                        </StyledPaper>
                    </Grid>
                );
            })}
        </Grid>
    );
}
