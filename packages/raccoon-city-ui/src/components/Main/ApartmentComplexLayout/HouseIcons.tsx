import React from 'react';
import {useMediaQuery, useTheme} from '@material-ui/core';
import HouseIcon from './HouseIcon';
import {HouseChooseContainer, StyledCarousel} from './styledComponents';

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
