import {Circle, Path, PathArray, PathCommand, SVG, Svg} from '@svgdotjs/svg.js';
import React, {useEffect, useRef, useState} from 'react';
import styled from 'styled-components';

const POINT_RADIUS = 15;

const ImageContainer = styled.div<any>`
    width: ${(props: any) => props.width}px;
    height: ${(props: any) => props.height}px;
    background: url(${(props: any) => props.url});
    background-size: 100%;
`;

const ImageMask = styled.img`
    height: 100%;
    width: auto;
    position: absolute;
    top: -999999px;
    left: -9999999px;
    z-index: -1;
    visibility: hidden;
`;

const MainContainer = styled.div`
    display: inline-block;
    max-width: 100%;
    overflow-x: auto;
    overflow-y: scroll;
`;

function attachSvg(container: string) {
    return SVG()
        .addTo(container)
        .size('100%', '100%');
}

function drawInitialCircle(circle: Circle, closePath: (circle: Circle) => void) {
    circle.addClass('SVG__circle--highlighted').fill('#f44336');

    const circleClick = (event: Event) => {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        circle.stroke({color: '#3f51b5', width: 3}).fill('transparent');
        circle.off('click', circleClick);
        circle.removeClass('SVG__circle--highlighted');
        closePath(circle);
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

interface DrawingOptions {
    onSelected: (path: Path) => void;
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
            initialCircle = drawInitialCircle(circle, (initCircle) => {
                const newCoordinate: PathCommand = ['L', initCircle.cx(), initCircle.cy()];
                coordinates.push(newCoordinate);
                const [, x, y] = coordinates[coordinates.length - 1];

                path = draw.path(['M', x || 0, y || 0, ...newCoordinate]).stroke({color: '#3f51b5', width: 3});

                path.plot(coordinates)
                    .fill({color: '#000', opacity: 0.5})
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
            path = draw.path(['M', mouseEvent.offsetX, mouseEvent.offsetY]).stroke({color: '#3f51b5', width: 3});
            paths.push(path);
        } else {
            const newCircle = drawCircle(circle);
            const [, x, y] = coordinates[coordinates.length - 1];
            const newCoordinate: PathCommand = ['L', newCircle.cx(), newCircle.cy()];
            coordinates.push(newCoordinate);
            path = draw
                .path(['M', x || 0, y || 0, ...newCoordinate])
                .stroke({color: '#3f51b5', width: 3})
                .on('click', (event: MouseEvent) => {
                    event.preventDefault();
                    event.stopPropagation();
                });
            paths.push(path);
        }
    });
}

interface ItemWithPath {
    path: string;
}

function fillExistingLayouts(svgItem: Svg, layouts: ItemWithPath[], onClickFn: (layout: any) => void) {
    const pathArray: Path[] = [];
    layouts.forEach((item) => {
        const path = svgItem
            .path(JSON.parse(item.path))
            .fill({color: '#000', opacity: 0.5})
            .stroke({color: '#3f51b5', width: 3})
            .addClass('SVG--highlighted')
            .on('click', (event: Event) => {
                event.preventDefault();
                event.stopPropagation();
                onClickFn(item);
            });
        pathArray.push(path);
    });
}

export function LayoutSelection({imageUrl, onPathClosed, layouts, onLayoutSelected}) {
    const svgRef = useRef<Svg>();
    const [imageSize, setImageSize] = useState({width: 0, height: 0});
    const [path, setPath] = useState<any>(null);

    useEffect(() => {
        svgRef.current = attachSvg('#img-container');
        initDrawing(svgRef.current, {
            onSelected: (svgPath) => {
                setPath(svgPath);
            }
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (svgRef && svgRef.current && layouts) {
            svgRef.current.clear();
            setPath(null);
            fillExistingLayouts(svgRef.current, layouts, (layout) => {
                onLayoutSelected(layout);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [layouts]);

    useEffect(() => {
        if (path !== null) {
            onPathClosed(path, imageSize);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [path]);

    const setImageSizes = (width, height) => {
        setImageSize({
            width,
            height
        });
        if (svgRef.current) {
            svgRef.current.viewbox(0, 0, width, height);
        }
    };

    return (
        <MainContainer>
            <ImageContainer id="img-container" width={imageSize.width} height={imageSize.height} url={imageUrl} />
            <ImageMask
                src={imageUrl}
                onLoad={(event) => {
                    const img: any = event.target;
                    if (img.width < img.naturalWidth || img.height < img.naturalHeight) {
                        setImageSizes(img.naturalWidth, img.naturalHeight);
                    } else {
                        setImageSizes(img.width, img.height);
                    }
                }}
            />
        </MainContainer>
    );
}
