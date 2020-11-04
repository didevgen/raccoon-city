import React from 'react';
import styled, {css} from 'styled-components';
import Slider from 'react-slick';
import {TabPanel} from '../../ApartmentComplexBuilder/ApartmentComplexInfo/ApartmentComplexInfo';

export const SectionBarContainer = styled.div<{isSideBarOpen: boolean}>`
    max-height: 80vh;
    width: 487px;
    margin-left: 30px;

    @media only screen and (max-width: 600px) {
        display: ${({isSideBarOpen}) => (isSideBarOpen ? 'block' : 'none')};
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        padding: 0 10px;
        background-color: #fff;
        width: 100vw;
        z-index: 2000;
        max-height: none;
        height: 100vh;
        overflow-y: auto;
        margin-left: 0;
    }

    .MuiTab-textColorInherit {
        padding: 0 23px;
    }

    .MuiTab-root {
        width: auto;
    }
`;

export const SliderContainer = styled.div`
    position: relative;

    .MuiSvgIcon-root {
        fill: #fff;
    }
`;

export const CustomSlider = styled(Slider)`
    display: flex;
    width: 100%;
    margin-bottom: 10px;

    img {
        width: 487px;
        height: 364px;
        border-radius: 10px;
    }

    @media only screen and (max-width: 600px) {
        margin-bottom: 10px;

        img {
            width: 320px;
            height: 200px;
        }
    }
`;

export const SideBarImage = styled.img`
    width: 100%;
    height: 297px;
    border-radius: 10px;
`;

export const SideBarVRImage = styled(SideBarImage)`
    cursor: pointer;
`;

export const TabPanelContainer = styled(TabPanel)`
    .MuiBox-root {
        padding: 0;
    }

    .MuiTypography-root {
        max-height: 75%;
        overflow-y: auto;
    }

    .MuiTableCell-root {
        padding: 16px 0;
    }

    @media only screen and (max-width: 600px) {
        margin-top: 20px;

        .MuiBox-root {
            width: 100%;
        }

        .MuiTableCell-root {
            padding: 5px 0;
        }
    }
`;

export const AppBarContainer = styled.div`
    margin-bottom: 5px;

    .MuiAppBar-root {
        border-radius: 10px;
    }

    .MuiTabs-indicator {
        display: none;
    }

    .Mui-selected {
        color: #e84f1d;
        border-right: 1px solid rgba(100, 99, 99, 0.2);
    }

    .MuiTab-root {
        border-right: 1px solid rgba(100, 99, 99, 0.2);
    }

    .MuiTab-root:last-child {
        border-right: none;
    }

    .MuiTab-textColorInherit {
        opacity: 1;
    }

    @media only screen and (max-width: 600px) {
    }
`;

export const CloseBarContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;

    .MuiSvgIcon-root {
        fill: #e84f1d;
        font-size: 30px;
    }
`;
