import React from 'react';
import {useMediaQuery, useTheme} from '@material-ui/core';
import HouseIcon from './HouseIcon';
import styled from 'styled-components';
import Carousel from 'react-elastic-carousel';

const HouseChooseContainer = styled.div`
    display: flex;
    justify-content: center;
    margin-bottom: 16px;
`;

const StyledCarousel = styled(Carousel)`
    .rec-swipable {
        align-items: center;
    }

    .rec-dot {
        border-radius: 0;
        height: 12px;
        background-color: #c4c4c4;
        box-shadow: none;
    }

    .rec-dot_active {
        background-color: #e84f1d;
    }

    .rec-arrow {
        margin: 0 20px;
        background-color: #c4c4c4;
        color: #fff;
        font-size: 1em;
        height: 30px;
        width: 30px;
        min-width: 30px;
        line-height: 30px;
    }

    .kjvGFn:hover {
        background-color: #e84f1d;
    }
`;

function HouseIcons({data, hoveredHouse, setHoveredHouse}) {
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const layoutLength = data.getApartmentComplexLayout.layouts.length;

    const maxItemsToScreem = matches ? 5 : 10;

    if (maxItemsToScreem < layoutLength) {
        return (
            <HouseChooseContainer>
                <StyledCarousel itemsToShow={layoutLength >= maxItemsToScreem ? maxItemsToScreem : layoutLength}>
                    {data.getApartmentComplexLayout.layouts
                        .sort((a, b) => {
                            return a.house.order - b.house.order;
                        })
                        .map((layout) => {
                            return (
                                <HouseIcon
                                    key={layout.house.id}
                                    house={layout.house}
                                    hoveredItem={hoveredHouse}
                                    setHoveredItem={setHoveredHouse}
                                />
                            );
                        })}
                </StyledCarousel>
            </HouseChooseContainer>
        );
    }

    return (
        <HouseChooseContainer>
            {data.getApartmentComplexLayout.layouts
                .sort((a, b) => {
                    return a.house.order - b.house.order;
                })
                .map((layout) => {
                    return (
                        <HouseIcon
                            key={layout.house.id}
                            house={layout.house}
                            hoveredItem={hoveredHouse}
                            setHoveredItem={setHoveredHouse}
                        />
                    );
                })}
        </HouseChooseContainer>
    );
}

export default HouseIcons;
