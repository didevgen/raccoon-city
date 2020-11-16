import {useQuery} from '@apollo/react-hooks';
import {Path, SVG, Svg} from '@svgdotjs/svg.js';
import Cookies from 'js-cookie';
import React, {useEffect, useRef, useState} from 'react';
import {useHistory, useLocation, useParams} from 'react-router';
import {Redirect} from 'react-router-dom';
import styled from 'styled-components';
import {API_TOKEN} from '../../../core/constants';
import {GET_APARTMENT_COMPLEX_LAYOUT} from '../../../graphql/queries/layoutQuery';
import HouseIcons from './HouseIcons';

const LayoutContainer = styled.div`
    height: 100vh;
`;

const ImageContainer = styled.div`
    display: flex;
    max-height: 80vh;
`;

const LayoutImage = styled.div<any>`
    flex: 1;
    background: url(${(props: any) => props.url}) no-repeat center;
    background-size: contain;
`;

function attachSvg(container: string) {
    return SVG()
        .addTo(container)
        .size('100%', '80vh');
}

function fillExistingLayouts(
    svgItem: Svg,
    {layouts, developerUuid, apartmentComplexUuid},
    {history, location},
    setHoveredHouse
) {
    const pathArray: Path[] = [];
    const params = new URLSearchParams(location.search);
    const authToken = params.get('authToken');

    layouts.forEach((layout) => {
        const {path: pathValue, viewBox} = layout;
        const pathParsed = JSON.parse(pathValue);
        const path = svgItem
            .viewbox(0, 0, viewBox.width, viewBox.height)
            .path(pathParsed)
            .fill({color: '#000', opacity: 0.5})
            .stroke({color: '#3f51b5', width: 3})
            .addClass('SVG--highlighted')
            .attr('id', `svg${layout.house.id}`)
            .on('mouseover', () => {
                setHoveredHouse(layout.house);
            })
            .on('mouseleave', () => {
                setHoveredHouse(null);
            })
            .on('click', () => {
                // @ts-ignore
                if (window.location !== window.parent.location) {
                    // @ts-ignore
                    window.parent.postMessage(
                        `${process.env.REACT_APP_PUBLIC_BASE_URL}/developers/${developerUuid}/apartmentComplex/${apartmentComplexUuid}/houseGrid/${layout.house.id}?authToken=${authToken}`,
                        '*'
                    );
                } else {
                    window.open(
                        `${process.env.REACT_APP_PUBLIC_BASE_URL}/developers/${developerUuid}/apartmentComplex/${apartmentComplexUuid}/houseGrid/${layout.house.id}?authToken=${authToken}`,
                        '_blank'
                    );
                }
            });
        pathArray.push(path);
    });
}

function ImageWithSvg({url, imageId, layouts, setHoveredHouse}) {
    const svgRef = useRef<Svg>();
    const history = useHistory();
    const location = useLocation();
    const {apartmentComplexUuid, developerUuid} = useParams() as any;

    useEffect(() => {
        svgRef.current = attachSvg(`#${imageId}`);
        if (svgRef && svgRef.current) {
            fillExistingLayouts(
                svgRef.current,
                {layouts, developerUuid, apartmentComplexUuid},
                {history, location},
                setHoveredHouse
            );
        }
        // eslint-disable-next-line
    }, []);
    return <LayoutImage id={imageId} url={url} alt={'layout image'} />;
}

export default function ApartmentComplexLayout() {
    const {layoutUuid} = useParams() as any;
    const imageId = `apartment-complex-layout-${layoutUuid}`;

    const [hoveredHouse, setHoveredHouse] = useState<any>(null);
    useEffect(() => {
        if (hoveredHouse) {
            document.querySelector(`#svg${hoveredHouse.id}`)?.classList.add('active');
        } else {
            document.querySelector(`#${imageId} .active`)?.classList.remove('active');
        }
    }, [hoveredHouse]); // eslint-disable-line

    const {loading, error, data} = useQuery(GET_APARTMENT_COMPLEX_LAYOUT, {
        variables: {
            uuid: layoutUuid
        },
        fetchPolicy: 'cache-and-network'
    });

    const params = new URLSearchParams(window.location.search);
    const authToken = params.get('authToken');
    if (authToken) {
        Cookies.set(API_TOKEN, authToken, {expires: 365});
    } else {
        return <Redirect to="/login" />;
    }

    if (loading || error) {
        return null;
    }
    return (
        <LayoutContainer>
            <HouseIcons data={data} hoveredHouse={hoveredHouse} setHoveredHouse={setHoveredHouse} />
            <ImageContainer>
                <ImageWithSvg
                    imageId={imageId}
                    setHoveredHouse={setHoveredHouse}
                    url={data.getApartmentComplexLayout.image.downloadUrl}
                    layouts={data.getApartmentComplexLayout.layouts}
                />
            </ImageContainer>
        </LayoutContainer>
    );
}
