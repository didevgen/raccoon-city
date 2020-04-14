import {useMutation} from '@apollo/react-hooks';
import {Circle, Path, PathArray, PathCommand, Svg, SVG} from '@svgdotjs/svg.js';
import React, {useEffect, useRef, useState} from 'react';
import styled from 'styled-components';
import {
    ASSIGN_FLAT_LAYOUT_TO_LEVEL,
    ASSIGN_FLAT_LAYOUT_TO_LEVEL_LAYOUT
} from '../../../../graphql/mutations/layoutMutation';
import {HouseLayout} from '../../../shared/types/layout.types';
import {LevelFlatLayout} from '../../../shared/types/level.types';
import {FlatLayoutPreviewDialog} from '../FlatLayoutPreviewDialog/FlatLayoutPreviewDialog';
import {FlatLayoutSelectionDialog} from '../FlatLayoutSelectionDialog/FlatLayoutSelectionDialog';

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

export function addCircles(path: Path, draw: Svg) {
    const pathArray = path.array();
    const startIndex = pathArray[1][0] === 'M' ? 1 : 0;
    const circles = [];
    for (let i = startIndex; i < pathArray.length; i++) {
        const item = pathArray[i];
        const x = item[1] || 0;
        const y = item[2] || 0;
        const circle = draw.circle(POINT_RADIUS).move(x - POINT_RADIUS / 2, y - POINT_RADIUS / 2);
        drawCircle(circle);
        // @ts-ignore
        circles.push(circle);
    }
    return circles;
}

function fillExistingLayouts(
    svgItem: Svg,
    flatLayouts: LevelFlatLayout[],
    onClickFn: (flatLayout: LevelFlatLayout) => void
) {
    const pathArray: Path[] = [];
    flatLayouts.forEach((flatLayout) => {
        const path = svgItem
            .path(JSON.parse(flatLayout.path))
            .fill({color: '#000', opacity: 0.5})
            .stroke({color: '#3f51b5', width: 3})
            .addClass('SVG--highlighted')
            .on('click', (event: Event) => {
                event.preventDefault();
                event.stopPropagation();
                onClickFn(flatLayout);
            });
        pathArray.push(path);
    });
}

interface LevelLayoutSelectionProps {
    imageUrl: string;
    levelLayoutId: string;
    flatLayouts: any;
    refetchLayouts: () => void;
}
export function LevelLayoutSelection({
    imageUrl,
    levelLayoutId,
    flatLayouts,
    refetchLayouts
}: LevelLayoutSelectionProps) {
    const svgRef = useRef<Svg>();
    const [isHouseLayoutsOpen, setHouseLayoutsDialogState] = useState(false);
    const [isFlatLayoutOpen, setFlatLayoutDialogState] = useState(false);
    const [selectedFlatLayout, setSelectedFlatLayout] = useState<LevelFlatLayout>();
    const [selectionPath, setSelectionPath] = useState<Path>();
    const [imageSize, setImageSize] = useState({width: 0, height: 0});

    const [assignFlatLayouts] = useMutation(ASSIGN_FLAT_LAYOUT_TO_LEVEL);
    const [assignFlatLayoutsToLevelLayout] = useMutation(ASSIGN_FLAT_LAYOUT_TO_LEVEL_LAYOUT);

    useEffect(() => {
        svgRef.current = attachSvg('#img-container');
        initDrawing(svgRef.current, {
            onSelected: (path) => {
                setHouseLayoutsDialogState(true);
                setSelectionPath(path);
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (svgRef && svgRef.current && flatLayouts) {
            svgRef.current.clear();
            fillExistingLayouts(svgRef.current, flatLayouts, (flatLayout) => {
                setSelectedFlatLayout(flatLayout);
                setFlatLayoutDialogState(true);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [flatLayouts]);

    return (
        <MainContainer>
            <ImageContainer id="img-container" width={imageSize.width} height={imageSize.height} url={imageUrl} />
            <FlatLayoutSelectionDialog
                open={isHouseLayoutsOpen}
                setOpen={setHouseLayoutsDialogState}
                onLayoutSelected={async (layout?: HouseLayout) => {
                    await assignFlatLayouts({
                        variables: {
                            levelLayoutId,
                            flatLayoutId: layout?.id,
                            path: JSON.stringify(selectionPath?.array().flat())
                        }
                    });
                    refetchLayouts();
                }}
            />
            {selectedFlatLayout && (
                <FlatLayoutPreviewDialog
                    refetchLayouts={refetchLayouts}
                    open={isFlatLayoutOpen}
                    setOpen={setFlatLayoutDialogState}
                    flatLayout={selectedFlatLayout}
                    layoutAssigned={async (layout: HouseLayout) => {
                        await assignFlatLayoutsToLevelLayout({
                            variables: {
                                layoutAssignmentId: selectedFlatLayout.id,
                                flatLayoutId: layout.id
                            }
                        });
                        refetchLayouts();
                    }}
                />
            )}
        </MainContainer>
    );
}
