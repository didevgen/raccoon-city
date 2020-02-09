import {Circle, Path, PathArray, PathCommand, Svg, SVG} from '@svgdotjs/svg.js';
import React, {useEffect, useRef, useState} from 'react';
import styled from 'styled-components';

const ImageContainer = styled.div<any>`
    width: ${(props: any) => props.width}px;
    height: ${(props: any) => props.height}px;
    background: url(${(props: any) => props.url});
`;

const MainContainer = styled.div`
    display: inline-block;
    max-width: 100%;
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

function drawInitialCircle(circle: Circle, closePath: () => void) {
    circle.addClass('SVG__circle--highlighted').fill('#f44336');

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

function drawCircle(circle: Circle) {
    return circle
        .stroke({color: '#3f51b5', width: 3})
        .fill('transparent')
        .addClass('SVG__circle-general--highlighted');
}

function handleClickOnCircle(draw: Svg, mouseEvent: MouseEvent) {
    const tagName = (mouseEvent.target as any).tagName;
    let circle;
    if (tagName === 'circle') {
        circle = new Circle(mouseEvent.target as SVGCircleElement);
    } else {
        circle = draw
            .circle(POINT_RADIUS)
            .move(mouseEvent.offsetX - POINT_RADIUS / 2, mouseEvent.offsetY - POINT_RADIUS / 2);
    }

    return circle;
}

function initDrawing(draw: Svg, options: DrawingOptions) {
    let path: Path;
    let circles: Circle[] = [];
    let paths: Path[] = [];

    let coordinates: PathArray = new PathArray();
    let initialCircle: Circle | null = null;
    draw.on('contextmenu', (event: Event) => {
        event.preventDefault();
        const circleToRemove = circles.pop();
        const pathToRemove = paths.pop();
        coordinates.pop();
        if (pathToRemove) {
            pathToRemove.remove();
        }

        if (circleToRemove) {
            circleToRemove.remove();
            if (circles.length === 0) {
                initialCircle = null;
            }
        }
    });

    draw.on('click', (mouseEvent: MouseEvent) => {
        const circle = handleClickOnCircle(draw, mouseEvent);
        circles.push(circle);
        if (!initialCircle) {
            initialCircle = drawInitialCircle(circle, () => {
                path.plot(coordinates)
                    .addClass('SVG--highlighted')
                    .on('click', (event: Event) => {
                        event.preventDefault();
                        event.stopPropagation();
                    });
                options.onSelected(path);
                coordinates = new PathArray();
                circles = [];
                paths = [];
                initialCircle = null;
            });
            coordinates.push(['M', mouseEvent.offsetX, mouseEvent.offsetY]);
            path = draw
                .path(['M', mouseEvent.offsetX, mouseEvent.offsetY])
                .fill({color: '#000', opacity: 0.5})
                .stroke({color: '#3f51b5', width: 3});
            paths.push(path);
        } else {
            const newCircle = drawCircle(circle);
            const [, x, y] = coordinates[coordinates.length - 1];
            const newCoordinate: PathCommand = ['L', newCircle.cx(), newCircle.cy()];
            coordinates.push(newCoordinate);
            path = draw
                .path(['M', x || 0, y || 0, ...newCoordinate])
                .fill({color: '#000', opacity: 0.5})
                .stroke({color: '#3f51b5', width: 3})
                .on('click', (event: MouseEvent) => {
                    event.preventDefault();
                    event.stopPropagation();
                });
            paths.push(path);
        }
    });
}

export function LevelEditor() {
    const svgRef = useRef<Svg>();
    const imageUrl = 'https://pb8920.profitbase.ru/uploads/layout/8920/8caceb62651d0efa08c2050dda8f14a7.png';
    const [imageSize, setImageSize] = useState({width: 0, height: 0});
    useEffect(() => {
        svgRef.current = attachSvg('#img-container');
        initDrawing(svgRef.current, {
            onSelected: (path) => {
                console.log('selected');
            }
        });

        const img = new Image();
        img.src = imageUrl;
        img.onload = () => {
            setImageSize({
                width: img.naturalWidth,
                height: img.naturalHeight
            });
        };
    }, []);

    return (
        <MainContainer>
            <ImageContainer id="img-container" width={imageSize.width} height={imageSize.height} url={imageUrl} />
        </MainContainer>
    );
}
