import {Circle, Path, PathArray, Svg, SVG} from '@svgdotjs/svg.js';
import React, {useEffect, useRef} from 'react';
import styled from 'styled-components';

const ImageContainer = styled.div`
    width: 3000px;
    height: 100vh;
    background: url(https://pb8920.profitbase.ru/uploads/layout/8920/8caceb62651d0efa08c2050dda8f14a7.png);
`;

const MainContainer = styled.div`
    display: inline-block;
    max-width: 100%;
    border: 3px dashed #eaeaea;
    padding: 15px;
    overflow-x: auto;
    overflow-y: scroll;
`;

const POINT_RADIUS = 15;

function attachSvg(container: string) {
    return SVG()
        .addTo(container)
        .size('100%', '100%');
}

interface DrawingOptions {
    onSelected: (path: Path) => void;
}

function drawInitialCircle(draw: Svg, mouseEvent: MouseEvent, closePath: () => void) {
    const circle = draw
        .circle(POINT_RADIUS)
        .addClass('SVG__circle--highlighted')
        .fill('#f44336')
        .move(mouseEvent.offsetX - POINT_RADIUS / 2, mouseEvent.offsetY - POINT_RADIUS / 2);

    const circleClick = (event: Event) => {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        circle.stroke({color: '#3f51b5', width: 3}).fill('transparent');
        circle.off('click', circleClick);
        circle.removeClass('SVG__circle--highlighted');
        closePath();
    };

    return circle.on('click', circleClick);
}

function drawCircle(draw: Svg, mouseEvent: MouseEvent) {
    return draw
        .circle(POINT_RADIUS)
        .stroke({color: '#3f51b5', width: 3})
        .fill('transparent')
        .move(mouseEvent.offsetX - POINT_RADIUS / 2, mouseEvent.offsetY - POINT_RADIUS / 2);
}

function initDrawing(draw: Svg, options: DrawingOptions) {
    let path: Path;
    let coordinates: PathArray = new PathArray();
    let initialCircle: Circle | null = null;
    draw.on('click', (mouseEvent: MouseEvent) => {
        if (!initialCircle) {
            initialCircle = drawInitialCircle(draw, mouseEvent, () => {
                path.plot(coordinates)
                    .addClass('SVG--highlighted')
                    .on('click', (event: Event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        event.stopImmediatePropagation();
                    });
                options.onSelected(path);
                coordinates = new PathArray();
                initialCircle = null;
            });
            coordinates.push(['M', mouseEvent.offsetX, mouseEvent.offsetY]);
            path = draw
                .path(['M', mouseEvent.offsetX, mouseEvent.offsetY])
                .fill({color: '#000', opacity: 0.5})
                .stroke({color: '#3f51b5', width: 3});
        } else {
            drawCircle(draw, mouseEvent);
            coordinates.push(['L', mouseEvent.offsetX, mouseEvent.offsetY]);
            path = draw
                .path(['M', mouseEvent.offsetX, mouseEvent.offsetY])
                .fill({color: '#000', opacity: 0.5})
                .stroke({color: '#3f51b5', width: 3});
        }
    });
}

export function LevelEditor() {
    const svgRef = useRef<Svg>();
    useEffect(() => {
        svgRef.current = attachSvg('#img-container');
        initDrawing(svgRef.current, {
            onSelected: (path) => {
                console.log('selected');
            }
        });
    }, []);

    return (
        <MainContainer>
            <ImageContainer id="img-container" />
        </MainContainer>
    );
}
